import {JwtQueryRepository} from "../queryRepository/jwt-query-repository";
import {JwtService} from "../domain/jwt-service";
import {devicesService} from "./devices-composition-root";

export const jwtQueryRepository = new JwtQueryRepository();
export const jwtService = new JwtService(jwtQueryRepository, devicesService);