import { Request, Response } from 'express';
import { TestingRepository } from './testing-repository';
import { Controller, Delete } from '@nestjs/common';

@Controller('/hometask-nest/testing/all-data')
export class TestingController {
  constructor(protected testingRepository: TestingRepository) {}

  @Delete()
  async deleteAllData() {
    await this.testingRepository.deleteAllData();
    return;
  }
}
