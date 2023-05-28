import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/types";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";
import {Response} from "express";
import {ViewAllUsersModels, ViewUserModel} from "../models/UsersModels/ViewUserModel";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {usersService} from "../domain/users-service";
import {UriIdModel} from "../models/UriModels";

export const usersController = {

    async getAllUsers(req: RequestWithQuery<QueryUserModel>,
                      res: Response<ViewAllUsersModels>) {

        const result = await usersQueryRepository.getAllUsers(req.query);
        res.status(200).send(result);
    },

    async createUser(req: RequestWithBody<CreateUserModel>,
                     res: Response<ViewUserModel>) {

        const result = await usersService.createUser(req.body);
        res.status(201).send(result);
    },

    async deleteUser(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        const result = await usersService.deleteSingleUser(req.params.id);
        result ? res.sendStatus(204)
            : res.sendStatus(404);
    }
}