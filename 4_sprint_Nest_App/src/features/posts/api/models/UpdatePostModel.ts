import { IsString, Length } from 'class-validator';

export class UpdatePostModel {
  @IsString({ message: 'It should be a string' })
  @Length(0, 30)
  title: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 100)
  shortDescription: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 1000)
  content: string;

  @IsString({ message: 'It should be a string' })
  blogId: string;
}
