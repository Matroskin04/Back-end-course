import { IsString, Length, Matches } from 'class-validator';

export class UpdateBlogModel {
  @IsString({ message: 'It should be a string' })
  @Length(0, 15)
  name: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 500)
  description: string;

  @IsString({ message: 'It should be a string' })
  @Length(0, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    {
      message: 'Incorrect websiteUrl',
    },
  )
  websiteUrl: string;
}
