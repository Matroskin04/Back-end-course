import {Request, Response, Router} from "express";
export const testingRoutes = Router();
import {allVideos} from "../index";

testingRoutes.delete('/all-data', (req: Request, res: Response) => {
    allVideos.length = 0;
    res.send(204)
})
