import {DevicesRepository} from "../repositories/devices-repository";
import {DevicesQueryRepository} from "../queryRepository/devices-query-repository";
import {DevicesService} from "../domain/devices-service";
import {DevicesController} from "../controllers/devices-controller";
import {jwtQueryRepository} from "./jwt-composition-root";

const devicesRepository = new DevicesRepository();
export const devicesQueryRepository = new DevicesQueryRepository();
export const devicesService = new DevicesService(jwtQueryRepository, devicesQueryRepository, devicesRepository);
export const devicesController = new DevicesController(devicesQueryRepository, devicesService);