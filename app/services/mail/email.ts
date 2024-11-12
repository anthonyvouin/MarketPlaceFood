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

export const sendWelcomeEmail = async (email: string, name: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirmation création de compte",
    text: `Bonjour ${name},\n\nBienvenue sur notre site. Nous sommes ravis de vous compter parmi nous !`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color:#EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #85BC39;">Bonjour <strong>${name}</strong>,</h2>
          <p>Bienvenue sur notre site !</p>
          <p>Nous sommes ravis de vous compter parmi nous !</p>
          <p>Pour commencer, vous pouvez explorer nos fonctionnalités et découvrir tout ce que nous avons à offrir.</p>
          <p>À bientôt,<br>L'équipe Snap&Shop</p>
          <footer style="font-size: 12px; color: #777;">
              <p>Vous recevez cet email parce que vous avez créé un compte sur notre site.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${email}`);
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

export const sendVerificationEmail = async (email: string, token: string) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.APP_URL}/profil/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Vérification de l'email",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #85BC39;">Bonjour,</h2>
          <p>Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail :</p>
          <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #85BC39; color: white; text-decoration: none; border-radius: 5px;">Vérifier mon e-mail</a>
          <footer style="font-size: 12px; color: #777;">
              <p>Si vous n'avez pas demandé de vérification d'adresse e-mail, veuillez ignorer cet email.</p>
          </footer>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de vérification envoyé à ${email}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email de vérification : ${error}`);
  }
};