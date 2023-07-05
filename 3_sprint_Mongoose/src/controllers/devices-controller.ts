import {Request, Response} from "express";
import {ViewDeviceModel} from "../models/DevicesModels/ViewDeviceModel";
import {RequestWithParams} from "../types/requests-types";
import {UriIdModel} from "../models/UriModels";
import {HTTP_STATUS_CODE} from "../helpers/http-status";
import {DevicesQueryRepository} from "../queryRepository/devices-query-repository";
import {DevicesService} from "../domain/devices-service";


class DevicesController {

    devicesQueryRepository: DevicesQueryRepository
    devicesService: DevicesService
    constructor() {
        this.devicesQueryRepository = new DevicesQueryRepository()
        this.devicesService = new DevicesService()
    }

    async getAllDevices(req: Request, res: Response<ViewDeviceModel>) {

        try {
            const result = await this.devicesQueryRepository.getAllDevicesByUserId(req.userId!.toString());
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async deleteDevicesExcludeCurrent(req: Request, res: Response<string>) {

        try {
            await this.devicesService.deleteDevicesExcludeCurrent(req.refreshToken);
            res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async deleteDeviceById(req: RequestWithParams<UriIdModel>, res: Response<string>) {

        try {
            const result = await this.devicesService.deleteDeviceById(req.params.id, req.userId!.toString());
            res.status(result.status).send(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}
export const devicesController = new DevicesController();