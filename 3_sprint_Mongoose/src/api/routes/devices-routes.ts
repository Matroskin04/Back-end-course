import {Router} from "express";
import {validateRefreshToken} from "../../middlewares/validation-middlewares/jwt-validation-middlewares";
import {container} from "../../composition-root";
import {DevicesController} from "../controllers/devices-controller";

export const devicesRoutes = Router();
const devicesController = container.resolve(DevicesController);

devicesRoutes.get('/',
    validateRefreshToken,
    devicesController.getAllDevices.bind(devicesController))

devicesRoutes.delete('/',
    validateRefreshToken,
    devicesController.deleteDevicesExcludeCurrent.bind(devicesController))

devicesRoutes.delete('/:id',
    validateRefreshToken,
    devicesController.deleteDeviceById.bind(devicesController))
