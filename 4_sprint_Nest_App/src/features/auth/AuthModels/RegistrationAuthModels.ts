import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RegistrationAuthModels {
  @IsString({ message: 'It should be a string' })
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'Incorrect login. Please, use only latin letters and numbers',
  })
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

export class ConfirmationCodeAuthModel {
  @IsString({ message: 'It should be a string' })
  code: string;
}

export class EmailResendingAuthModel {
  @IsEmail({}, { message: 'Incorrect Email' })
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: 'Incorrect Email',
  })
  email: string;
}
