import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { Order, OrderItem, Product, StatusOrder } from '@prisma/client';
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail } from '@/app/services/mail/email';

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '',);
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

type OrderWithRelations = Order & {
  user: { email: string | null };
  orderItems: (OrderItem & { product: Product })[];
};

const findUserByStripeCustomerId = async (stripeCustomerId: string) => {
  return await prisma.user.findFirst({
    where: { stripeCustomerId }
  });
};

const findPendingOrder = async (userId: string, maxRetries = 3): Promise<OrderWithRelations | null> => {
  for (let i = 0; i < maxRetries; i++) {
    const order = await prisma.order.findFirst({
      where: {
        userId,
        status: StatusOrder.PAYMENT_PENDING,
      },
      include: {
        user: true,
        orderItems: {
          include: { product: true }
        }
      }
    });

    if (order) return order;
    
    console.log(`Tentative ${i + 1}/${maxRetries} de recherche de commande...`);
    await wait(1000);
  }
  return null;
};

const updateOrderStatus = async (orderId: string, newStatus: StatusOrder) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus }
  });
};

const updateProductStocks = async (orderItems: (OrderItem & { product: Product })[]) => {
  const stockUpdates = orderItems.map(item => 
    prisma.product.update({
      where: { id: item.product.id },
      data: { stock: item.product.stock - item.quantity }
    })
  );
  await Promise.all(stockUpdates);
};

const sendOrderEmails = async (order: OrderWithRelations, type: 'success' | 'failed') => {
  if (!order.user.email) return;

  if (type === 'success') {
    await sendPaymentConfirmationEmail(order.user.email, {
      orderNumber: order.id,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingZipCode: order.shippingZipCode
    });
  } else {
    await sendPaymentFailedEmail(order.user.email, {
      orderNumber: order.id,
      totalAmount: order.totalAmount
    });
  }
};

export async function webhook(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Méthode non autorisée', { status: 405 });
  }

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Signature manquante', { status: 400 });
  }

  try {
    const rawBody = await req.arrayBuffer();
    const textBody = new TextDecoder().decode(rawBody);
    const event = stripe.webhooks.constructEvent(
      textBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        await paymentSucceded(event.data.object as Stripe.PaymentIntent, 'success');
        break;
      case 'payment_intent.payment_failed':
        await paymentSucceded(event.data.object as Stripe.PaymentIntent, 'failed');
        break;
      default:
        console.log(`Événement inattendu reçu : ${event.type}`);
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('Erreur webhook:', err);
    return new Response(
      err instanceof Error ? `Webhook Error: ${err.message}` : 'Webhook Error',
      { status: 400 }
    );
  }
}

export const paymentSucceded = async (paymentIntent: Stripe.PaymentIntent, type: 'success' | 'failed') => {
  console.log('PaymentIntent reçu:', { id: paymentIntent.id, amount: paymentIntent.amount });

  try {
    const user = await findUserByStripeCustomerId(paymentIntent.customer as string);
    if (!user) {
      console.log('Utilisateur non trouvé');
      return;
    }

    const order = await findPendingOrder(user.id);
    if (!order) {
      console.log('Commande non trouvée');
      return;
    }

    await updateOrderStatus(
      order.id,
      type === 'success' ? StatusOrder.PAYMENT_SUCCEDED : StatusOrder.PAYMENT_FAILED
    );

    if (type === 'success') {
      await updateProductStocks(order.orderItems);
    }

    await sendOrderEmails(order, type);
    
    console.log(`Paiement ${type} traité avec succès pour la commande ${order.id}`);
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error);
    throw error;
  }
};