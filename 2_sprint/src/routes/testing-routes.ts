import {Request, Response, Router} from "express";
import {testingRepositories} from "../repositories/testing-repositories";

export const testingRoutes = Router();

testingRoutes.delete('/', (req: Request, res: Response) => {

    testingRepositories.deleteAllPosts();
    res.sendStatus(204);
});