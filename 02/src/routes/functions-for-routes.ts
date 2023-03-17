/*import {validationResult} from "express-validator";
import {errorsMessagesType} from "../types";


export const getFoundErrors = (req: Request) => {
    const myValidationResult = validationResult.withDefaults({
        formatter: error => {
            return {
                message: error.msg,
                field: error.param
            };
        },
    });
    const errors = myValidationResult(req);

    allErrorsPost = {
        errorsMessages: errors.array()
    };
}
 */