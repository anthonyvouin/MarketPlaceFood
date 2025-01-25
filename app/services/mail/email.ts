import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendWelcomeEmail = async (email: string, name: string, token: string, isGoogleUser: boolean) => {
  const transporter = createTransporter();

  let verificationUrl = "";
  if (!isGoogleUser) {
    verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirmation de compte et Bienvenue",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color:#EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #85BC39;">Bonjour <strong>${name}</strong>,</h2>
          <p>Bienvenue sur notre site ! Nous sommes ravis de vous compter parmi nous !</p>
          ${
            isGoogleUser
              ? `<p>Nous sommes ravis que vous ayez utilisé Google pour vous connecter. Nous avons activé votre compte et vous pouvez commencer à explorer notre site.</p>`
              : `<p>Pour commencer, veuillez vérifier votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
                 <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #85BC39; color: white; text-decoration: none; border-radius: 5px;">Vérifier mon e-mail</a>`
          }
          <p>Pour explorer nos fonctionnalités, connectez-vous dès que votre compte est vérifié.</p>
          <footer style="font-size: 12px; color: #777;">
              <p>Si vous n'avez pas demandé de création de compte, veuillez ignorer cet email.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de bienvenue envoyé à ${email}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email : ${error}`);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Réinitialisation de mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #85BC39;">Bonjour,</h2>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
          <a href="${resetUrl}" style="padding: 10px 20px; background-color: #85BC39; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
          <p>Ce lien expirera dans une heure.</p>
          <footer style="font-size: 12px; color: #777;">
              <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet email.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de réinitialisation envoyé à ${email}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email : ${error}`);
  }
};

export const sendPaymentConfirmationEmail = async (email: string, orderDetails: {
  orderNumber: string;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingZipCode: string;
}) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirmation de votre commande",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #85BC39;">Confirmation de votre commande</h2>
          <p>Nous vous remercions pour votre commande. Votre paiement a été traité avec succès !</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #85BC39;">Détails de la commande</h3>
            <p><strong>Numéro de commande :</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Montant total :</strong> ${(orderDetails.totalAmount / 100).toFixed(2)}€</p>
            
            <h4 style="color: #85BC39; margin-top: 20px;">Adresse de livraison</h4>
            <p>${orderDetails.shippingAddress}</p>
            <p>${orderDetails.shippingZipCode} ${orderDetails.shippingCity}</p>
          </div>

          <p>Nous vous tiendrons informé du statut de votre commande par email.</p>
          
          <footer style="font-size: 12px; color: #777; margin-top: 20px;">
              <p>Pour toute question concernant votre commande, n'hésitez pas à nous contacter.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmation de paiement envoyé à ${email}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email de confirmation : ${error}`);
  }
};

export const sendPaymentFailedEmail = async (email: string, orderDetails: {
  orderNumber: string;
  totalAmount: number;
}) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Échec du paiement de votre commande",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #FFF0F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #D32F2F;">Échec du paiement</h2>
          <p>Nous sommes désolés, mais le paiement de votre commande n'a pas pu être traité.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #D32F2F;">Détails de la commande</h3>
            <p><strong>Numéro de commande :</strong> ${orderDetails.orderNumber}</p>
            <p><strong>Montant total :</strong> ${(orderDetails.totalAmount / 100).toFixed(2)}€</p>
          </div>

          <p>Vous pouvez réessayer le paiement en vous rendant sur notre site.</p>
          
          <footer style="font-size: 12px; color: #777; margin-top: 20px;">
              <p>Si vous avez des questions ou besoin d'aide, n'hésitez pas à nous contacter.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email d'échec de paiement envoyé à ${email}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email d'échec : ${error}`);
  }
};