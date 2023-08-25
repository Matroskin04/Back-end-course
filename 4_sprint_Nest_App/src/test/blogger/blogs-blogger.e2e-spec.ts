import { INestApplication } from '@nestjs/common';
import { UserModelType } from '../../features/users/domain/users.db.types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import process from 'process';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { appSettings } from '../../app.settings';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../features/users/domain/users.entity';
import mongoose from 'mongoose';
import request from 'supertest';
import { HTTP_STATUS_CODE } from '../../infrastructure/utils/enums/http-status';
import { loginUserTest } from '../public/auth/auth-public.helpers';
import {
  createBlogTest,
  createResponseAllBlogsTest,
  getAllBlogsBloggerTest,
} from './blogs-blogger.helpers';
import { createUserTest } from '../super-admin/users-sa.helpers';
import { createErrorsMessageTest } from '../helpers/errors-message.helper';

describe('Blogs, Post, Comments (Blogger); /blogger/blogs', () => {
  jest.setTimeout(5 * 60 * 1000);

  //vars for starting app and testing
  let app: INestApplication;
  let UserModel: UserModelType;
  let mongoServer: MongoMemoryServer;
  let httpServer;

  beforeAll(async () => {
    //activate mongoServer
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env['MONGO_URL'] = mongoUri;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSettings(app); //activate settings for app
    await app.init();

    httpServer = app.getHttpServer();

    UserModel = moduleFixture.get<UserModelType>(getModelToken(User.name));
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await httpServer.close();
    await app.close();
  });
  let user;
  let accessToken;

  const correctBlogName = 'correctName';
  const correctDescription = 'correctDescription';
  const correctWebsiteUrl =
    'https://SoBqgeyargbRK5jx76KYc6XS3qU9LWMJCvbDif9VXOiplGf4-RK0nhw34lvql.zgG73ki0po16f.J4U96ZRvoH3VE_WK';

  const nameLengthIs16 = 'a'.repeat(16);
  const webSiteLengthIs101 = 'a'.repeat(101);
  const descritionLengthIs501 = 'a'.repeat(501);

  describe(`/blogs (POST) - create blog`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        'correct',
        'correctPass',
        'correctEmail@gmail.com',
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result = await loginUserTest(
        httpServer,
        user.body.login,
        'correctPass',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      accessToken = result.body.accessToken;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await createBlogTest(
        httpServer,
        'IncorrectJWT',
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (400) values of 'name', 'website' and 'description' are incorrect (large length)
              - (400) values of 'name' (not string), 'website' (incorrect format) and 'description' (not string) are incorrect`, async () => {
      const result1 = await createBlogTest(
        httpServer,
        accessToken,
        nameLengthIs16,
        descritionLengthIs501,
        webSiteLengthIs101,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(
        createErrorsMessageTest(['name', 'description', 'websiteUrl']),
      );

      const result2 = await createBlogTest(
        httpServer,
        accessToken,
        null,
        null,
        'IncorrectURL',
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result2.body).toEqual(
        createErrorsMessageTest(['name', 'description', 'websiteUrl']),
      );
    });

    it(`+ (201) should create blog`, async () => {
      const result = await createBlogTest(
        httpServer,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      expect(result.body).toEqual({
        id: expect.any(String),
        name: correctBlogName,
        description: correctDescription,
        websiteUrl: correctWebsiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });
  });

  describe(`/blogs (GET) - get all blogs`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        'correct',
        'correctPass',
        'correctEmail@gmail.com',
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result = await loginUserTest(
        httpServer,
        user.body.login,
        'correctPass',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      accessToken = result.body.accessToken;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await createBlogTest(
        httpServer,
        'IncorrectJWT',
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });
    //todo query + banned
    it(`+ (200) should return empty array`, async () => {
      const result = await getAllBlogsBloggerTest(httpServer, accessToken, '');
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      expect(result.body).toEqual(createResponseAllBlogsTest(1, 1, 10, 0, []));
    });

    // it(`(Addition) + (201) should create 10 blogs
    //           + (200) should return empty array all (not banned) blogs`, async () => {
    //   const result1 = creat;
    //   const result = await getAllBlogsBloggerTest(
    //     httpServer,
    //     'IncorrectJWT',
    //     '',
    //   );
    //   expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
    // });
  });
});
