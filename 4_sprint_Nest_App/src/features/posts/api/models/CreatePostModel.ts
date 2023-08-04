import { IsString, Length, Matches } from 'class-validator';

export type CreatePostModel = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export class CreatePostByBlogIdModel {
  @IsString({ message: 'It should be a string' })
  @Length(0, 30)
  title: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 100)
  shortDescription: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 1000)
  content: string;
}
