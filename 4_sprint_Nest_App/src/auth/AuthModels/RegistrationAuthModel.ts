export type RegistrationAuthModel = {
  login: string;
  email: string;
  password: string;
};

export type RegisterConfirmAuthModel = { code: string };

export type RegisterResendConfirmAuthModel = { email: string };
