import {Router} from "express";
import {validateRefreshToken} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {devicesController} from "../composition-root/devices-composition-root";

export const devicesRoutes = Router();


devicesRoutes.get('/',
    validateRefreshToken,
    devicesController.getAllDevices.bind(devicesController))

devicesRoutes.delete('/',
    validateRefreshToken,
    devicesController.deleteDevicesExcludeCurrent.bind(devicesController))

devicesRoutes.delete('/:id',
    validateRefreshToken,
    devicesController.deleteDeviceById.bind(devicesController))
