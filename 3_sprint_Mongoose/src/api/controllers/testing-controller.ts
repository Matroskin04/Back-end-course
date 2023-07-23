import {Request, Response} from "express";
import { injectable } from "inversify";
import {TestingRepository} from "../../infrastructure/repositories/testing-repository";


@injectable()
export class TestingController {

    constructor(protected testingRepository: TestingRepository) {}

    async deleteAllData(req: Request, res: Response<void>) {

            await this.testingRepository.deleteAllData();
            res.sendStatus(204);
    }
}

