import {Request, Response} from "express";
import {ViewDeviceModel} from "../models/DevicesModels/ViewDeviceModel";
import {devicesQueryRepository} from "../queryRepository/devices-query-repository";
import {devicesService} from "../domain/devices-service";
import {RequestWithParams} from "../types/types";
import {UriIdModel} from "../models/UriModels";

export const devicesController = {

    async getAllDevices(req: Request, res: Response<ViewDeviceModel>) {

    const result = await devicesQueryRepository.getAllDevicesByUserId(req.userId!.toString());
    res.status(200).send(result);
},

    async deleteDevicesExcludeCurrent(req: Request, res: Response<void>)  {

    await devicesService.deleteDevicesExcludeCurrent(req.refreshToken);
    res.sendStatus(204);
},

    async deleteDeviceById(req: RequestWithParams<UriIdModel>, res: Response<void>) {

    const result = await devicesService.deleteDeviceById(req.params.id, req.userId!.toString());
    res.sendStatus(result);
}
}