import { Router } from "express";
import { eventRegistrationController } from "../controllers/eventRegistrationController";
const eventRegistrationRouter = Router();
eventRegistrationRouter.get("/get", eventRegistrationController.getAll);
eventRegistrationRouter.get("/:eventId", eventRegistrationController.getRegisteredByEventId);
eventRegistrationRouter.get("/getbyuserid/:userId", eventRegistrationController.getByUserId);
eventRegistrationRouter.post("/add", eventRegistrationController.add);
eventRegistrationRouter.delete("/delete/:id", eventRegistrationController.delete);
eventRegistrationRouter.put("/update/:id", eventRegistrationController.update);
eventRegistrationRouter.delete("/delete-by-event/:eventId", eventRegistrationController.deleteByEventId);

export default eventRegistrationRouter;