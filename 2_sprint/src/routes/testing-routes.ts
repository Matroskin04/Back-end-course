import {Request, Response, Router} from "express";
import {testingRepositories} from "../repositories/testing-repositories";

export const testingRoutes = Router();

testingRoutes.delete('/', async (req: Request, res: Response<void>) => {

    await testingRepositories.deleteAllData();
    res.sendStatus(204);
});