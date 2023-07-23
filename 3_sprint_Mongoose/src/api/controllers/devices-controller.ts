import {Request, Response} from "express";
import {ViewDeviceModel} from "../../models/DevicesModels/ViewDeviceModel";
import {RequestWithParams} from "../../types/requests-types";
import {UriIdModel} from "../../models/UriModels";
import {HTTP_STATUS_CODE} from "../../helpers/enums/http-status";
import {DevicesQueryRepository} from "../../infrastructure/queryRepository/devices-query-repository";
import {DevicesService} from "../../domain/devices-service";
import { injectable } from "inversify";


@injectable()
export class DevicesController {

    constructor(protected devicesQueryRepository: DevicesQueryRepository,
                protected devicesService: DevicesService) {
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
