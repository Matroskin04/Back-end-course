import {UsersRepository} from "../repositories/users-repository";
import {UsersQueryRepository} from "../queryRepository/users-query-repository";
import {UsersService} from "../domain/users-service";
import {UsersController} from "../controllers/users-controller";

export const usersRepository = new UsersRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersService = new UsersService(usersRepository, usersQueryRepository);
export const usersController = new UsersController(usersQueryRepository, usersService);