import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { Order, StatusOrder } from '@prisma/client';
import { sendPaymentConfirmationEmail, sendPaymentFailedEmail } from '@/app/services/mail/email';

const stripe: Stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '',);

export async function webhook(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Méthode non autorisée', { status: 405 });
  }

  const sig: string | null = req.headers.get('stripe-signature');
  if (!sig) {
    return new Response('Signature manquante', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody: ArrayBuffer = await req.arrayBuffer();
    const textBody: string = new TextDecoder().decode(rawBody);

    event = stripe.webhooks.constructEvent(
      textBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    if (err instanceof Error) {
      console.error('Erreur lors de la validation du webhook Stripe', err.message);
      return new Response(`Webhook Error ${err.message}`);
    }
    return new Response(`Webhook Error`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent: Stripe.PaymentIntent = event.data.object;
      await paymentSucceded(paymentIntent, 'success');
      break;
    case 'payment_intent.payment_failed':
      const paymentFailed = event.data.object;
      await paymentSucceded(paymentFailed, 'failed');
      break;
    default:
      console.log(`Événement inattendu reçu : ${event.type}`);
  }

  return new Response('OK', { status: 200 });
}


export const paymentSucceded = async (paymentIntent: Stripe.PaymentIntent, type: 'success' | 'failed') => {
  const order = await prisma.order.findFirst({
    where: {
      totalAmount: paymentIntent.amount,
      status: StatusOrder.PAYMENT_PENDING,
      user: {
        stripeCustomerId: paymentIntent.customer as string,
      }
    },
    include: {
      user: true
    }
  }) as (Order & { user: { email: string | null } }) | null;

  if (order) {
    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: type === 'success' ? StatusOrder.PAYMENT_SUCCEDED : StatusOrder.PAYMENT_FAILED
      }
    });
    
    if (order.user.email) {
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
    }
  }
};