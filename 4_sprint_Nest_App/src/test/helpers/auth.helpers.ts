import request from 'supertest';

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
