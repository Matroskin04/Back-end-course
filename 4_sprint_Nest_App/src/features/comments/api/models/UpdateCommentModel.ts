import { IsString, Length } from 'class-validator';

export class UpdateCommentModel {
  @IsString({ message: 'It should be a string' })
  @Length(20, 300)
  content: string;
}
