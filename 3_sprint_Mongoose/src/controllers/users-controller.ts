import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/requests-types";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";
import {Response} from "express";
import {ViewAllUsersModels, ViewUserModel} from "../models/UsersModels/ViewUserModel";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {usersService} from "../domain/users-service";
import {UriIdModel} from "../models/UriModels";
import {HTTP_STATUS_CODE} from "../helpers/http-status";

export const usersController = {

    async getAllUsers(req: RequestWithQuery<QueryUserModel>,
                      res: Response<ViewAllUsersModels>) {

        try {
            const result = await usersQueryRepository.getAllUsers(req.query);
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async createUser(req: RequestWithBody<CreateUserModel>,
                     res: Response<ViewUserModel>) {

        try {
            const result = await usersService.createUser(req.body);
            res.status(HTTP_STATUS_CODE.CREATED_201).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async deleteUser(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        try {
            const result = await usersService.deleteSingleUser(req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}