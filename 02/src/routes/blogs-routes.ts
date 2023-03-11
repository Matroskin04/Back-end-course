import {Router, Request, Response} from "express";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {authorization, checkErrors} from "../middlewares/middlewares";
import {validationResult} from "express-validator";

export const blogsRoutes = Router();

blogsRoutes.get('/', (req: Request, res: Response) => {

    const result = blogsRepositories.getBlogs();

    res.status(200).send(result);
})
blogsRoutes.post('/', authorization, checkErrors, (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send(400).json({ errors: errors.array() });
    } else {
        const result = blogsRepositories.createBlog(req.body);
        return res.status(201).send(result);
    }
})