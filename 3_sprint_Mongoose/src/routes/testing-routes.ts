import {Router} from "express";
import {testingController} from "../composition-root";

export const testingRoutes = Router();


testingRoutes.delete('/',
    testingController.deleteAllData.bind(testingController)
);