import {ResponseTypeService} from "../../service-types/responses-types-service";

export const createResponseService = (statusCode: number, message: any): ResponseTypeService => { //todo можно добавить data отдельно от мессадж
    return {
        status: statusCode,
        message: message
    }
}