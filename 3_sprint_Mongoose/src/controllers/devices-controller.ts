import {Request, Response} from "express";
import {ViewDeviceModel} from "../models/DevicesModels/ViewDeviceModel";
import {devicesQueryRepository} from "../queryRepository/devices-query-repository";
import {devicesService} from "../domain/devices-service";
import {RequestWithParams} from "../types/requests-types";
import {UriIdModel} from "../models/UriModels";
import {HTTP_STATUS_CODE} from "../helpers/http-status";

export const devicesController = {

    async getAllDevices(req: Request, res: Response<ViewDeviceModel>) {

        try {
            const result = await devicesQueryRepository.getAllDevicesByUserId(req.userId!.toString());
            res.status(HTTP_STATUS_CODE.OK_200).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async deleteDevicesExcludeCurrent(req: Request, res: Response<string>) {

        try {
            await devicesService.deleteDevicesExcludeCurrent(req.refreshToken);
            res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    },

    async deleteDeviceById(req: RequestWithParams<UriIdModel>, res: Response<string>) {

        try {
            const result = await devicesService.deleteDeviceById(req.params.id, req.userId!.toString());
            res.status(result.status).send(result.message);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}