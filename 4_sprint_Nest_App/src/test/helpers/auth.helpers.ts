import request from 'supertest';
import { HTTP_STATUS_CODE } from '../../infrastructure/utils/enums/http-status';

export async function registerUserTest(
  httpServer,
  login: string,
  password: string,
  email: string,
) {
  return request(httpServer).post('/hometask-nest/auth/registration').send({
    login,
    password,
    email,
  });
}

export async function confirmEmailTest(
  httpServer,
  confirmationCode: string | undefined,
) {
  return request(httpServer)
    .post(`/hometask-nest/auth/registration-confirmation`)
    .send({
      code: confirmationCode ?? '',
    });
}

export async function loginUserTest(
  httpServer,
  loginOrEmail: string,
  password: string,
) {
  return request(httpServer)
    .post(`/hometask-nest/auth/login`)
    .send({ loginOrEmail, password });
}

// export async function getCurrentUserInfoTest(httpServer, jwt: string) {
//   return request(httpServer).get(`/hometask-nest/auth/me`).;
// }
