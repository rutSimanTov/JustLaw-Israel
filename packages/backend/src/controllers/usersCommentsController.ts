import { Request, Response } from 'express';
import * as usersCommentsService from '../services/usersCommentsService';

export const writeComment = async (req: Request, res: Response) => {
  try {
    const { content, userId, articleId, isAnonymous, displayName } = req.body;
    if (!content || !userId || !articleId ) return res.status(401).json({ error: "Missing parameter" });
    const comment = await usersCommentsService.writeComment(content, userId, articleId, isAnonymous, displayName);
    res.status(201).json(comment);
    console.log("displayName from frontend:", displayName);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

export const getComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.query;
    if (!articleId) return res.status(400).json({ error: "Missing article id" });
    const comments = await usersCommentsService.getComments(articleId as string);
    res.status(200).json(comments);
  }
  catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

// עדכון תגובה
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, content } = req.body;
    if (!id || !userId || !content) return res.status(400).json({ error: "Missing parameter" });
    const updated = await usersCommentsService.updateComment(Number(id), userId, content);
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// מחיקת תגובה
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!id || !userId) return res.status(400).json({ error: "Missing parameter" });
    const deleted = await usersCommentsService.deleteComment(Number(id), userId);
    res.json(deleted);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

  


//for commit
