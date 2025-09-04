import { Router } from "express";
import { authenticateJWT } from '../middlewares/auth';
import * as draftController from "../controllers/draftController";
const router = Router();

router.get("/recycle-bin/all", authenticateJWT, draftController.getMyDraftVersions);
router.post("/restore-as-new", authenticateJWT, draftController.createDraftFromVersion);

// שאר הראוטים
router.get("/user/:userId", draftController.getDraftsByUser);
router.delete("/recycle-bin/:versionId",  draftController.deleteDraftPermanently);
router.get("/:id/history", draftController.getDraftHistory);
router.post("/:id/restore/:versionId", draftController.restoreDraft);
router.get("/:id", draftController.getDraft);
router.post("/", draftController.createDraft);
router.put("/:id", draftController.saveDraft);
router.delete("/:id", draftController.deleteDraft);

export default router;
//for commit


