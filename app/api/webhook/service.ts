import Stripe from 'stripe';

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
    const rawBody:ArrayBuffer = await req.arrayBuffer();
    const textBody:string = new TextDecoder().decode(rawBody);

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
      const paymentIntent:Stripe.PaymentIntent = event.data.object;
      console.log('Paiement réussi :', paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const paymentFailed = event.data.object;
      console.log('Paiement échoué :', paymentFailed);
      break;
    default:
      console.log(`Événement inattendu reçu : ${event.type}`);
  }

  return new Response('OK', { status: 200 });
}
