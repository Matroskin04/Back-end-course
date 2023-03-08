import {Request, Response, Router} from "express";
export const testingRoutes = Router();
import {allVideos} from "../index";

testingRoutes.delete('/', (req: Request, res: Response) => {
    allVideos.length = 0;
    res.send(204)
})
