import { Router } from "express";
import { cohortEventController } from "../controllers/cohortEventController";

const cohortEventRoute = Router();
cohortEventRoute.get("/get", cohortEventController.getAll);
cohortEventRoute.get("/getbyid/:id", cohortEventController.getById);
cohortEventRoute.post("/add", cohortEventController.add);
cohortEventRoute.delete("/delete/:id", cohortEventController.delete);
cohortEventRoute.put("/update/:id", cohortEventController.update);

export default cohortEventRoute;
