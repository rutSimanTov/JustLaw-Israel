

import { Request, Response } from "express";
import { AuthRequest } from '../middlewares/auth'; // או מאיפה שמוגדר אצלך
import * as draftService from "../services/draftService";
export const getDraft = async (req: Request, res: Response) => {
  try {
    const draft = await draftService.getDraftById(Number(req.params.id));
    if (!draft) return res.status(404).json({ error: "טיוטה לא נמצאה" });
    res.json(draft);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const createDraft = async (req: Request, res: Response) => {
  try {
    const { content, userId } = req.body;
    if (!userId) return res.status(401).json({ error: "Missing userId" });
    const draft = await draftService.createDraft(content, userId);
    res.json(draft);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const saveDraft = async (req: Request, res: Response) => {
  try {
    const { content, lastUpdated, override , userId} = req.body;
    const result = await draftService.saveDraftWithConflict(
      Number(req.params.id),
      content,
      lastUpdated,
      override,
      userId // הוסיפי כאן

    );
    if (result.conflict)
      return res.status(409).json({ serverDraft: result.serverDraft });
    res.json({ success: true, lastUpdated: result.lastUpdated });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
export const deleteDraft = async (req: Request, res: Response) => {
  try {
    const ok = await draftService.deleteDraft(Number(req.params.id));
    if (!ok) return res.status(404).json({ error: "טיוטה לא קיימת" });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
export const getDraftHistory = async (req: Request, res: Response) => {
  try {
    const history = await draftService.getDraftHistory(Number(req.params.id));
    res.json(history);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
export const restoreDraft = async (req: Request, res: Response) => {
  try {
    const draftId = Number(req.params.id);
    const versionId = Number(req.params.versionId);
    const restored = await draftService.restoreDraftFromVersion(
      draftId,
      versionId
    );
    res.json({ success: true, restored });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
export const getDraftsByUser = async (req: Request, res: Response) => {
  try {
    const userId = (req.params.userId);
    const drafts = await draftService.getDraftsByUserId(userId);
    res.json(drafts);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};
export const getMyDrafts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // או req.user?.userId לפי ה-JWT שלך
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const drafts = await draftService.getDraftsByUserId(userId);
    res.json(drafts);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const getMyDraftVersions = async (req: AuthRequest, res: Response) => {
  try{
    const userId = req.user?.id; // או req.user?.userId לפי ה-JWT שלך
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const draftVersions = await draftService.getAllVersionsByUserId(userId);
    res.json(draftVersions);
  }
     catch (e: any) {
      res.status(500).json({ error: e.message });
    
  }
}

export const createDraftFromVersion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { versionId } = req.body;
    if (!userId || !versionId) return res.status(400).json({ error: "Missing userId or versionId" });
    const newDraft = await draftService.createDraftFromVersion(userId, versionId);
    res.json(newDraft);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const deleteDraftPermanently = async (req: Request, res: Response) => {
  try {
    const versionId = Number(req.params.versionId);
    if (!versionId) return res.status(400).json({ error: "Missing versionId" });
    const success = await draftService.DeleteDraftPermanently(versionId);
    res.json({ success });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};