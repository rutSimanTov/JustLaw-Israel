import { Request, Response } from 'express';
import { getContentById } from '../services/contentService';
import { generateArticlePdfBuffer } from '../services/downloadArticlePdfService';
function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9-_ ]/g, '_');
}
export const downloadArticlePdf = async (req: Request, res: Response) => {
  const articleId = req.params.id;
  const article = await getContentById(articleId);
  if (!article) return res.status(404).send('Article not found');

  // ודא שכל השדות קיימים
  const pdfBuffer = await generateArticlePdfBuffer({
    title: article.title ?? 'No Title',
    description: article.description ?? '',
    categoryid: article.categoryid ?? 'N/A',
    typeid: article.typeid ?? 'N/A',
    statusid: article.statusid ?? 'N/A',
  });

  res.setHeader('Content-Type', 'application/pdf');
const safeTitle = sanitizeFilename(article.title ?? 'No_Title');
res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);  res.send(pdfBuffer);
};