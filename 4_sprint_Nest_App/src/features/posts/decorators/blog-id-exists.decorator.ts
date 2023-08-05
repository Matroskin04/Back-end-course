import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from '../../blogs/infrastructure/repository/blogs-repository';

export function IsBlogIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      async: true,
      validator: IsBlogIdExistsConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsBlogIdExists' })
export class IsBlogIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(BlogsRepository) private readonly blogsRepository: BlogsRepository,
  ) {}
  async validate(value: string, args: ValidationArguments) {
    const blog = await this.blogsRepository.getBlogInstance(
      new ObjectId(value),
    );
    return !!blog;
  }
}
