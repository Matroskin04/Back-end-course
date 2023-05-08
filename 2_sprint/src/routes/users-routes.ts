import {Router, Response} from "express";
import {getErrors} from "../middlewares/validation-middlewares";
import {authorization} from "../middlewares/authorization-middelwares";
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {UriIdModel} from "../models/UriModels";
import {ViewAllUsersModels, ViewUserModel} from "../models/UsersModels/ViewUserModel";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {validateBodyOfUser} from "../middlewares/validation-middlewares/users-validation-middlewares";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";

export const usersRoutes = Router();
usersRoutes.get('/', authorization, async (req: RequestWithQuery<QueryUserModel>,
                                           res: Response<ViewAllUsersModels>) => {

    const result = await usersQueryRepository.getAllUsers(req.query);
    res.status(200).send(result);
})

usersRoutes.post('/', authorization, validateBodyOfUser, getErrors, async (req: RequestWithBody<CreateUserModel>,
                                                                           res: Response<ViewUserModel>) =>{
    const result = await usersService.createUser(req.body);
    res.status(201).send(result);
})

usersRoutes.delete('/:id', authorization, async (req: RequestWithParams<UriIdModel>, res: Response<void>) => {

    const result = await usersService.deleteSingleUser(req.params.id);
    result ? res.sendStatus(204)
        : res.sendStatus(404);
})