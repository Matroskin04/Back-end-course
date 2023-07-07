import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/requests-types";
import {QueryUserModel} from "../models/UsersModels/QueryUserModel";
import {Response} from "express";
import {ViewAllUsersModels, ViewUserModel} from "../models/UsersModels/ViewUserModel";
import {CreateUserModel} from "../models/UsersModels/CreateUserModel";
import {UriIdModel} from "../models/UriModels";
import {HTTP_STATUS_CODE} from "../helpers/enums/http-status";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";
import {UsersService} from "../domain/users-service";


export class UsersController {

    constructor(protected usersQueryRepository: UsersQueryRepository,
                protected usersService: UsersService) {
    }

    async getAllUsers(req: RequestWithQuery<QueryUserModel>,
                      res: Response<ViewAllUsersModels>) {

        try {
            const result = await this.usersQueryRepository.getAllUsers(req.query);
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async createUser(req: RequestWithBody<CreateUserModel>,
                     res: Response<ViewUserModel>) {

        try {
            const result = await this.usersService.createUser(req.body);
            res.status(HTTP_STATUS_CODE.CREATED_201).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async deleteUser(req: RequestWithParams<UriIdModel>,
                     res: Response<void>) {

        try {
            const result = await this.usersService.deleteSingleUser(req.params.id);

            result ? res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204)
                : res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}
