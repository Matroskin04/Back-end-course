import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { AppModule } from '../../app.module';
import { appSettings } from '../../app.settings';
import { HTTP_STATUS_CODE } from '../../infrastructure/utils/enums/http-status';
import * as process from 'process';
import { EmailAdapter } from '../../infrastructure/adapters/email.adapter';
import { emailAdapterMock } from './mock.providers/auth.mock.providers';
import {
  confirmEmailTest,
  loginUserTest,
  registerUserTest,
} from '../helpers/auth.helpers';
import { createErrorsMessageTest } from '../helpers/errors-message.helper';
import { UserModelType } from '../../features/users/domain/users.db.types';
import { User } from '../../features/users/domain/users.entity';
import { getModelToken } from '@nestjs/mongoose';
import { createUserTest } from '../helpers/users.helpers';
import { UserOutputModel } from '../../features/users/super-admin/api/models/output/user.output.model';
import any = jasmine.any;

describe('auth+comments All operation, chains: /auth + /posts/{id}/comments + /comments', () => {
  jest.setTimeout(5 * 60 * 1000);

  //vars for starting app and testing
  let app: INestApplication;
  let UserModel: UserModelType;
  let mongoServer: MongoMemoryServer;
  let httpServer;

  //providers

  //addition vars
  // let accessToken: string;
  // let idOfUser: ObjectId;
  // let idOfPost: ObjectId;
  // let idOfComment: ObjectId;
  // const confirmationCode: string | null = null;
  // const arrayOfComments: Array<CommentDBType> = [];
  // let refreshToken: string;

  let connection;

  beforeAll(async () => {
    //activate mongoServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env['MONGO_URL'] = mongoUri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailAdapter)
      .useValue(emailAdapterMock)
      .compile();

    app = moduleFixture.createNestApplication();
    appSettings(app); //activate settings for app
    await app.init();

    httpServer = app.getHttpServer();

    UserModel = moduleFixture.get<UserModelType>(getModelToken(User.name));
    console.log(UserModel);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await httpServer.close();
    await app.close();
  });

  let busyEmail; //todo как-то организовать
  let busyLogin;
  const freeCorrectEmail = 'freeEmail@gmail.com';
  const freeCorrectLogin = 'freeLogin';
  const correctPass = 'correctPass';
  let confirmationCode;
  //todo проверить jwt token

  describe('/auth/registration (POST) - Registration flow', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
    });

    it('+ (204) should register user successfully', async () => {
      const result = await registerUserTest(
        httpServer,
        'Egor123',
        '123qwe',
        'meschit9@gmail.com',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      expect(emailAdapterMock.sendEmailConfirmationMessage).toBeCalled();

      busyEmail = 'meschit9@gmail.com';
      busyLogin = 'Egor123';
    });

    //dependent
    it(`- (400) should not register if user with the given login already exists,
              - (400) should not register if user with the given email already exists`, async () => {
      //busy login
      const result1 = await registerUserTest(
        httpServer,
        busyLogin,
        '123qwe',
        freeCorrectEmail,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);

      expect(emailAdapterMock.sendEmailConfirmationMessage).not.toBeCalled();

      //busy email
      const result2 = await registerUserTest(
        httpServer,
        freeCorrectLogin,
        '123qwe',
        busyEmail,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);

      expect(emailAdapterMock.sendEmailConfirmationMessage).not.toBeCalled();
    });

    it(`- (400) should not register if input data is incorrect (small length of login and pass),
              - (400) should not register if input data is incorrect (big length of login),
              - (400) should not register if input data is incorrect (incorrect pattern login and email, big pass),`, async () => {
      const result1 = await registerUserTest(
        httpServer,
        'No',
        'Leng5',
        freeCorrectEmail,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(
        createErrorsMessageTest(['login', 'password']),
      );

      expect(emailAdapterMock.sendEmailConfirmationMessage).not.toBeCalled();

      const result2 = await registerUserTest(
        httpServer,
        'Length===11',
        'correct',
        freeCorrectEmail,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result2.body).toEqual(createErrorsMessageTest(['login']));

      const result3 = await registerUserTest(
        httpServer,
        'No-~^&*%',
        'length21IsMore20-----',
        'IncorrectEmail',
      );
      expect(result3.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result3.body).toEqual(
        createErrorsMessageTest(['login', 'email', 'password']),
      );
    });
  });

  describe(`/auth/registration-confirmation (POST) - Registration-confirmation`, () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
    });

    it(`+ (204) should confirm email successfully
              - (400) should not confirm email because of confirmation code is already been applied`, async () => {
      //register user
      const result1 = await registerUserTest(
        httpServer,
        freeCorrectLogin,
        correctPass,
        freeCorrectEmail,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //find confirmation code
      const userInfo = await UserModel.findOne(
        { login: freeCorrectLogin },
        { 'emailConfirmation.confirmationCode': 1 },
      );
      confirmationCode = userInfo?.emailConfirmation.confirmationCode;

      //confirm email
      const result2 = await confirmEmailTest(httpServer, confirmationCode);
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //code is already been applied
      const result3 = await confirmEmailTest(httpServer, confirmationCode);
      expect(result3.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result3.body).toEqual(createErrorsMessageTest(['code']));
    });

    //
    it(`- (400) should not confirm email because of confirmation code is incorrect
              - (400) should not confirm email because of confirmation code is expired`, async () => {
      //incorrect code
      const result1 = await confirmEmailTest(
        httpServer,
        'incorrectConfirmationCode',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(createErrorsMessageTest(['code']));

      //expired code
      //register user
      const result4 = await registerUserTest(
        httpServer,
        'Correct',
        correctPass,
        'correct@mail.ru',
      );
      expect(result4.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);
      const user = await UserModel.findOne({ login: 'Correct' });
      expect(user).not.toBeNull();
      //подменяем дату истечения срока кода
      user!.emailConfirmation.expirationDate = new Date();
      await user!.save();

      const result2 = await confirmEmailTest(
        httpServer,
        user?.emailConfirmation.confirmationCode,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result2.body).toEqual(createErrorsMessageTest(['code']));
    });
  });

  describe(`/auth/login (POST) - login user
                  /auth/logout (POST) - logout user`, () => {
    let user;
    beforeEach(() => {
      jest.clearAllMocks();
    });

    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        freeCorrectLogin,
        correctPass,
        freeCorrectEmail,
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
    });

    it(`+ (200) should login user with passed login
              + (200) should login user with passed email`, async () => {
      const result1 = await loginUserTest(
        httpServer,
        user.body.login,
        correctPass,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      expect(result1.body.accessToken).toBeDefined();
      expect(result1.headers['set-cookie'][0]).toBeDefined();

      const result2 = await loginUserTest(
        httpServer,
        user.body.email,
        correctPass,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
    });

    it(`- (200) should login user with passed login
              - (401) should login user with passed email`, async () => {});
    // describe(`/auth/me (GET) - get user info`, () => {
    //   beforeEach(() => {
    //     jest.clearAllMocks();
    //   });
    //
    //   beforeAll(async () => {
    //     await request(httpServer)
    //       .delete('/hometask-nest/testing/all-data')
    //       .expect(HTTP_STATUS_CODE.NO_CONTENT_204);
    //   });
    //
    //   it(`- (401) jwt access token is missed`, async () => {
    //     //registerUser
    //     const result1 = await registerUserTest(
    //       httpServer,
    //       freeCorrectLogin,
    //       correctPass,
    //       freeCorrectEmail,
    //     );
    //     expect(result1.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);
    //
    //     //jwt is missed
    //     const;
    //   });
  });
});
