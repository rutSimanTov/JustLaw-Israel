import { Router } from "express";
import { cohortController } from "../controllers/cohortController";

const cohortRoute = Router();

cohortRoute.get("/get", cohortController.getAll);
cohortRoute.post("/add", cohortController.add);
cohortRoute.delete("/delete/:id", cohortController.delete);
cohortRoute.put("/update/:id", cohortController.update);

export default cohortRoute;