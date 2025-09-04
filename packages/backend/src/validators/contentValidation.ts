export function validateContent(body: any): { valid: boolean; errors?: string[] } {
  const errors = [];

  if (!body.title || typeof body.title !== 'string') errors.push('Missing or invalid title');
  if (!body.description || typeof body.description !== 'string') errors.push('Missing or invalid description');

  const allowedCategory = [
    'research_papers', 'industry_news', 'case_studies', 'toolkits_guides', 'webinars'
  ];
  if (!allowedCategory.includes(body.category)) errors.push('Invalid category');

  const allowedType = ['article', 'link', 'document', 'video', 'webinar'];
  if (!allowedType.includes(body.type)) errors.push('Invalid type');

  const allowedStatus = ['draft', 'published', 'archived'];
  if (!allowedStatus.includes(body.status)) errors.push('Invalid status');

  if (!body.authorId || typeof body.authorId !== 'string') errors.push('Missing authorId');
  if (!Array.isArray(body.tags) || body.tags.length === 0) {
    errors.push('At least one tag is required');
  }
  if (typeof body.metadata !== 'object') errors.push('Invalid metadata');

  return { valid: errors.length === 0, errors };
}
