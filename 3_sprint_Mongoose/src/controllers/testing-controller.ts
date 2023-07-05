import {Request, Response} from "express";
import {TestingRepository} from "../repositories/testing-repository";

export class TestingController {

    testingRepository: TestingRepository
    constructor() {
        this.testingRepository = new TestingRepository()
    }

    async deleteAllData(req: Request, res: Response<void>) {

            await this.testingRepository.deleteAllData();
            res.sendStatus(204);
    }
}

export const testingController = new TestingController()