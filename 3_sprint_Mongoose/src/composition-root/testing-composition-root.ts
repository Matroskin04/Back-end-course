import {TestingRepository} from "../repositories/testing-repository";
import {TestingController} from "../controllers/testing-controller";

const testingRepository = new TestingRepository();
export const testingController = new TestingController(testingRepository);