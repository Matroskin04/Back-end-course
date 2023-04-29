import {Router, Response} from "express";
import {getErrors} from "../middlewares/validation-middlewares";
import {authorization} from "../middlewares/authorization-middelwares";
import {usersService} from "../domain/users-service";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {paramsModels, QueryModel} from "../models/UriModels";
import {ApiAllUsersModels, ApiUserModel} from "../models/UsersModels/ApiUserModel";
import {ApiAllErrorsModels} from "../models/ApiAllErrorsModels";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {validateBodyOfUser} from "../middlewares/users-middlewares";

export const usersRoutes = Router();
usersRoutes.get('/', authorization, async (req: RequestWithQuery<QueryModel>,
                                           res: Response<ApiAllUsersModels>) => {

    const result = await usersQueryRepository.getAllUsers(req.query);
    res.status(200).send(result);
})

usersRoutes.post('/', authorization, validateBodyOfUser, getErrors, async (req: RequestWithBody<CreateUserModel>,
                                                                           res: Response<ApiAllErrorsModels | ApiUserModel>) =>{
    const result = await usersService.createUser(req.body);
    res.status(201).send(result);
})

usersRoutes.delete('/:id', authorization, async (req: RequestWithParams<paramsModels>, res: Response<number>) => { // todo response number?

    const result = await usersService.deleteSingleUser(req.params.id);
    result ? res.sendStatus(204)
        : res.sendStatus(404);
})