import PDFDocument from 'pdfkit';

export async function generateArticlePdfBuffer(article: {
  title: string;
  description: string;
  categoryid: string | number;
  typeid?: string | number;
  statusid?: string | number;
}): Promise<Buffer> {
  const doc = new PDFDocument();
  const buffers: Buffer[] = [];

  doc.on('data', buffers.push.bind(buffers));
  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    doc.fontSize(20).text(article.title, { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Category: ${article.categoryid}`);
    if (article.typeid) doc.text(`Type: ${article.typeid}`);
    if (article.statusid) doc.text(`Status: ${article.statusid}`);
    doc.moveDown();
    doc.fontSize(12).text(article.description);

    doc.end();
  });
}