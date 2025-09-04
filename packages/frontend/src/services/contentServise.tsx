import axios from 'axios';
import { ContentItem } from '@base-project/shared/src/models/Content';
const API_URL = 'http://localhost:3000/api/content'; // כתובת ה-API שלך

export interface ContentCategory {
  id: number;
  name: string;
}

export const getAllContent = async (): Promise<ContentItem[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.data; // תלוי איך אתה מחזיר את זה מה-backend שלך
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

export const getAllCategories = async (): Promise<ContentCategory[]> => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


export async function createContentApi(data: any) {
  const response = await fetch('/api/content', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok || !json.success) {
    const errorMessage = json.message || 'Failed to create content';
    throw new Error(errorMessage);
  }

  return json.data;
}

export const deleteContent = async (id: string): Promise<boolean> => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    console.error('Failed to delete content:', await res.text());
    return false;
  }
  return true;
};

export const updateContent = async (
  id: string,
  updates: Partial<Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ContentItem | null> => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    console.error('Failed to update content:', await res.text());
    return null;
  }
  const updated = await res.json();
  return updated;
};