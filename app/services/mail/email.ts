import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (email: string, name: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Confirmation création de compte",
    text: `Bonjour ${name},\n\nBienvenue sur notre site. Nous sommes ravis de vous compter parmi nous !`,
    html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color:#EBF2F0; border: 1px solid #ddd; border-radius: 5px;">
            <img src="http://localhost:3000/images/logo.svg" alt="Logo de Snap&Shop" style="max-width: 100%; height: auto; margin-bottom: 20px;">

            <h2 style="color: #85BC39;">Bonjour <strong>${name}</strong>,</h2>
            <p style="font-size: 16px;">Bienvenue sur notre site !</p>
            <p style="font-size: 16px;">Nous sommes ravis de vous compter parmi nous !</p>
            <p style="font-size: 16px;">Pour commencer, vous pouvez explorer nos fonctionnalités et découvrir tout ce que nous avons à offrir.</p>
            <p style="font-size: 16px;">N'hésitez pas à nous contacter si vous avez des questions.</p>
            <p style="font-size: 16px;">À bientôt,<br>L'équipe Snap&Shop</p>
            <hr style="margin: 20px 0; border: 1px solid #ddd;">
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


export  const sendPasswordResetEmail = async (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Réinitialisation de mot de passe",
    html: `
      <div>
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour le faire :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Ce lien expirera dans une heure.</p>
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