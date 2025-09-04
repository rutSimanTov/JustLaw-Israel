import { Router } from "express";
import * as usersCommentsController from "../controllers/usersCommentsController";

const router = Router();

router.post("/", usersCommentsController.writeComment);
router.get("/", usersCommentsController.getComments);
router.put("/:id", usersCommentsController.updateComment);
router.delete("/:id", usersCommentsController.deleteComment);
;

export default router;

//for commit
