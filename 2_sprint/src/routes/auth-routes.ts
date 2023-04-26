import {Router, Response} from "express";
import {RequestWithBody} from "../types";
import {LoginInputModel} from "../models/AuthModels/LoginInputModel";

export const authRoutes = Router();

authRoutes.post('/login', async (req: RequestWithBody<LoginInputModel>, res: Response) => {

    
})
