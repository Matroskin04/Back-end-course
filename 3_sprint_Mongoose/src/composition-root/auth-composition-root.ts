import {AuthService} from "../domain/auth-service";
import {AuthController} from "../controllers/auth-controller";
import {jwtService} from "./jwt-composition-root";
import {devicesService} from "./devices-composition-root";
import {usersQueryRepository, usersRepository, usersService} from "./users-composition-root";
import {emailManager} from "./email-composition-root";

const authService = new AuthService(emailManager, jwtService, usersService, usersRepository, usersQueryRepository);
export const authController = new AuthController(jwtService, devicesService, authService);