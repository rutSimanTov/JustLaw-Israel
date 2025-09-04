const PDFDocument = require('pdfkit');
import { PassThrough } from 'stream';
const path = require('path');

export interface ReceiptDetails {
    donorName: string;
    amount: number;
    date: string;
    receiptNumber: string;
    transactionId: string;
    isAnonymous: boolean;
    currency: 'ILS' | 'USD' | 'EUR';
    timeZone: string; // ← הוספה חדשה

}

function currencySymbol(currency: string) {
    switch (currency) {
        case 'USD': return '$';
        case 'EUR': return '€';
        case 'ILS': return '₪';
        default: return '';
    }
}


export function generateReceiptHTML(details: ReceiptDetails) {
    return `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <img alt="Logo" src="cid:logo-img" style="width: 100px; height: auto; display: block; margin: 0 auto;" />
        <h1 style="text-align:center; color:#2c3e50;">JustLawIsrael</h1>
        <h2 style="text-align:center;">Donation Receipt</h2>
        <hr/>
        <p><b>Receipt #:</b> ${details.receiptNumber}</p>
        <p><b>Date:</b> ${new Date(details.date).toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: details.timeZone
    })}</p>
        <p><b>Donor:</b> ${details.isAnonymous ? 'Anonymous Donor' : details.donorName}</p>
        <p><b>Amount:</b> ${currencySymbol(details.currency)}${details.amount}</p>
        <p><b>Transaction ID:</b> ${details.transactionId}</p>
        <hr/>
        <p style="text-align:center;">This receipt is valid for tax purposes.</p>
        <p style="text-align:center; color:#888;">Thank you for your support!</p>
      </body>
    </html>
  `;
}

export function generateReceiptPDF(details: ReceiptDetails): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = new PassThrough();
        const chunks: Buffer[] = [];

        const fontPath = path.join(__dirname, '../../fonts/Assistant-Regular.ttf');
        doc.registerFont('Assistant', fontPath);
        doc.font('Assistant');

        doc.pipe(stream);

        // Logo
        try {
            const logoPath = require('path').join(__dirname, '../../picture/logo.png');
            doc.image(logoPath, doc.page.width / 2 - 50, 20, { width: 100 });
            doc.moveDown(5);
        } catch (e) {
            console.warn('⚠️ Logo not found for PDF generation');
        }

        // Header
        doc
            .fontSize(20)
            .fillColor('#2c3e50')
            .text('JustLawIsrael', { align: 'center' })
            .moveDown(0.5);

        doc
            .fontSize(16)
            .fillColor('black')
            .text('Donation Receipt', { align: 'center' })
            .moveDown(1.5);

        // Divider
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').stroke().moveDown(1.5);

        // Receipt Details
        doc.fontSize(12).fillColor('black');
        doc.text(`Receipt #: ${details.receiptNumber}`);
        doc.text(`Date: ${new Date(details.date).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
            timeZone: details.timeZone
        })}`);
        // const donorNameFixed = details.isAnonymous || !details.donorName
        //     ? 'Anonymous Donor'
        //     : `\u202B${details.donorName}\u202C`; // RTL wrapper
        // doc.text(`Donor: ${donorNameFixed}`);
        doc.text(`Donor: ${details.isAnonymous || !details.donorName ? 'Anonymous Donor' : details.donorName}`);
        doc.text(`Amount: ${currencySymbol(details.currency)}${details.amount}`);
        doc.text(`Transaction ID: ${details.transactionId}`);
        doc.moveDown(2);

        // Footer
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').stroke().moveDown(1.5);

        doc
            .fontSize(12)
            .fillColor('#333')
            .text('This receipt is valid for tax purposes.', { align: 'center' })
            .moveDown(0.5)
            .fillColor('#888')
            .text('Thank you for your support!', { align: 'center' });

        doc.end();

        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}