import {Request, Response, Router} from "express";
import {testingRepository} from "../repositories/testing-repository";

export const testingRoutes = Router();

testingRoutes.delete('/', async (req: Request, res: Response<void>) => {

    await testingRepository.deleteAllData();
    res.sendStatus(204);
});