import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { BlogsRepository } from '../../blogs/infrastructure/repository/blogs-repository';

@ValidatorConstraint({ name: 'IsBlogByIdExists', async: true })
export class IsBlogByIdExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(protected blogsRepository: BlogsRepository) {}
  async validate(value: string, args: ValidationArguments | any) {
    const blogId = args.object.blogId;

    const blog = await this.blogsRepository.getBlogInstance(
      new ObjectId(blogId),
    );
    return !!blog;
  }

  defaultMessage(args?: ValidationArguments): string {
    return `Blog with such blogId doesn't exist`;
  }
}
