import puppeteer from 'puppeteer';
import { getOrdersByUser } from '@/app/services/stripe/stripe'; // Utiliser votre fonction existante
import { prisma } from '@/app/libs/prisma'; // Assurez-vous d'avoir importé prisma

// Fonction qui génère le PDF de la commande
export async function generateInvoicePdf(userId: string, orderId: string): Promise<string> {
  try {
    // Récupérer la commande spécifique de l'utilisateur
    const orders = await getOrdersByUser(userId);
    const order = orders.find(order => order.id === orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // Générer le HTML de la facture
    const htmlContent = generateInvoiceHtml(order);

    // Utiliser Puppeteer pour générer le PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();

    // Encoder le PDF en base64
    const base64Pdf = pdfBuffer.toString('base64');
    return base64Pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Erreur lors de la génération du PDF');
  }
}

// Fonction pour générer le HTML de la facture
function generateInvoiceHtml(order: any): string {
  const itemsHtml = order.orderItems
    .map((item: any) => {
      return `
        <tr>
          <td>${item.product.name}</td>
          <td>${item.quantity}</td>
          <td>${(item.totalPrice / 100).toFixed(2)} €</td>
        </tr>
      `;
    })
    .join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Facture Commande #${order.id}</h1>
        <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
        <p>Status: ${order.status}</p>
        <p>Total: ${(order.totalAmount / 100).toFixed(2)} €</p>
        <h3>Détails des articles</h3>
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;
}
