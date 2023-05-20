import {Router, Response, Request} from "express";
import {validateRefreshToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {devicesQueryRepository} from "../queryRepository/devices-query-repository";
import {ViewDeviceModel} from "../models/DevicesModels/ViewDeviceModel";
import {devicesService} from "../domain/devices-service";
import {RequestWithParams} from "../types/types";
import {UriIdModel} from "../models/UriModels";

export const devicesRoutes = Router();


devicesRoutes.get('/', validateRefreshToken, async (req: Request, res: Response<ViewDeviceModel>) => {

    const result = await devicesQueryRepository.getAllDevices();
    res.status(200).send(result);
})

devicesRoutes.delete('/', validateRefreshToken, async (req: Request, res: Response) => {

    await devicesService.deleteDevicesExcludeCurrent(req.refreshToken);
    res.sendStatus(204);
})

devicesRoutes.delete('/:id', validateRefreshToken, async (req: RequestWithParams<UriIdModel>, res: Response) => {

    const result = await devicesService.deleteDeviceById(req.params.id, req.userId!.toString());
    res.sendStatus(result);
})
