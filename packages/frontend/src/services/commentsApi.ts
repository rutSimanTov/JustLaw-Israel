const BASE_API = "http://localhost:3001/api/usersComments";

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  article_id: string;
  user_id: string;
  is_anonymous: boolean;
  display_name: string;
}

export async function writeComment(
  content: string,
  userId: string,
  articleId: string | number,
  isAnonymous: boolean,
  displayName?: string

): Promise<Comment> {
  const res = await fetch(BASE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, userId, articleId, isAnonymous, displayName }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to write comment");
  }
  return await res.json();
}

export async function fetchComments(articleId: string | number): Promise<Comment[]> {
  const res = await fetch(`${BASE_API}?articleId=${articleId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  const data = await res.json();
  // המר display_name ל displayName
  return data as Comment[];
}

export async function updateComment(id: number, userId: string, content: string) {
  const res = await fetch(`${BASE_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content }),
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return await res.json();
}

export async function deleteComment(id: number, userId: string) {
  const res = await fetch(`${BASE_API}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return await res.json();
}


//for commit
