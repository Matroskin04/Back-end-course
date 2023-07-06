import {Request, Response} from "express";
import {TestingRepository} from "../repositories/testing-repository";

export class TestingController {

    constructor(protected testingRepository: TestingRepository) {}

    async deleteAllData(req: Request, res: Response<void>) {

            await this.testingRepository.deleteAllData();
            res.sendStatus(204);
    }
}

