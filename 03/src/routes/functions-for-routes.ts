import {validationResult} from "express-validator";
import {RequestWithBody} from "../types";
import {CreateBlogModel} from "../models/BlogsModels/CreateBlogModel";
import {CreatePostModel} from "../models/PostsModels/CreatePostModel";

export const GetErrors = (req: RequestWithBody<CreateBlogModel | CreatePostModel>) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    return errors.array()
}
