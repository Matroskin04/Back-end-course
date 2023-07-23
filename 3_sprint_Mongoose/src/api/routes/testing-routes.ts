import {Router} from "express";
import {container} from "../../composition-root";
import {TestingController} from "../controllers/testing-controller";

export const testingRoutes = Router();
const testingController = container.resolve(TestingController);


testingRoutes.delete('/',
    testingController.deleteAllData.bind(testingController)
);