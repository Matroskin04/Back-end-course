import {Router} from "express";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {authorization} from "../middlewares/authorization-middelwares";
import {validateBodyOfUser} from "../middlewares/validation-middlewares/users-validation-middlewares";
import {validateFormatOfUrlParams} from "../middlewares/urlParams-validation-middleware";
import {usersController} from "../controllers/users-controller";

export const usersRoutes = Router();

usersRoutes.get('/',
    authorization,
    usersController.getAllUsers.bind(usersController))

usersRoutes.post('/',
    authorization,
    validateBodyOfUser,
    getErrors,
    usersController.createUser.bind(usersController))

usersRoutes.delete('/:id',
    validateFormatOfUrlParams,
    authorization,
    usersController.deleteUser.bind(usersController))