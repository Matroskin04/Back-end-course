import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserModel {
  @IsString({ message: 'It should be a string' })
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsEmail({}, { message: 'Incorrect Email' })
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Incorrect Email',
  })
  email: string;

  @IsString({ message: 'It should be a string' })
  @Length(6, 20)
  password: string;
}
