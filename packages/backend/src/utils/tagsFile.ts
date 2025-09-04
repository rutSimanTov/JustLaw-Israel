import fs from 'fs';
import path from 'path';

const TAGS_PATH = path.join(__dirname, '../utils/tags.json');

export function readTags(): string[] {
  if (!fs.existsSync(TAGS_PATH)) return [];
  const raw = fs.readFileSync(TAGS_PATH, 'utf-8');
  const data = JSON.parse(raw);
  return data.tags || [];
}

export function writeTags(tags: string[]) {
  fs.writeFileSync(TAGS_PATH, JSON.stringify({ tags }, null, 2), 'utf-8');
}