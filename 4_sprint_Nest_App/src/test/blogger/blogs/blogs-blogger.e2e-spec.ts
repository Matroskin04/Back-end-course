import { INestApplication } from '@nestjs/common';
import { UserModelType } from '../../../features/users/domain/users.db.types';
import { MongoMemoryServer } from 'mongodb-memory-server';
import process from 'process';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { appSettings } from '../../../app.settings';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../../features/users/domain/users.entity';
import mongoose from 'mongoose';
import request from 'supertest';
import { HTTP_STATUS_CODE } from '../../../infrastructure/utils/enums/http-status';
import { loginUserTest } from '../../public/auth/auth-public.helpers';
import {
  createBlogTest,
  createResponseAllBlogsTest,
  createResponseSingleBlog,
  deleteBlogBloggerTest,
  getAllBlogsBloggerTest,
  updateBlogBloggerTest,
} from './blogs-blogger.helpers';
import { createUserTest } from '../../super-admin/users-sa.helpers';
import { createErrorsMessageTest } from '../../helpers/errors-message.helper';
import { ObjectId } from 'mongodb';
import {
  createPostTest,
  createResponseSinglePost,
  deletePostTest,
  getAllPostsTest,
  updatePostTest,
} from '../posts-blogger.helpers';
import { getPostByIdPublicTest } from '../../public/posts-public.helpers';
import { getBlogByIdPublicTest } from '../../public/blogs-public.helpers';
import { deleteAllDataTest } from '../../helpers/delete-all-data.helper';
import {
  createCorrectBlogTest,
  createCorrectUserTest,
  loginCorrectUserTest,
} from '../../helpers/chains-of-requests.helpers';

describe('Blogs, Post, Comments (Blogger); /blogger', () => {
  jest.setTimeout(5 * 60 * 1000);
  //todo flow with comments need to test
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
  const correctLogin = 'correct';
  const correctPass = 'correctPass';
  const correctEmail = 'correctEmail@gmail.com';

  //blogs
  let correctBlogId;
  const correctBlogName = 'correctName';
  const correctDescription = 'correctDescription';
  const correctWebsiteUrl =
    'https://SoBqgeyargbRK5jx76KYc6XS3qU9LWMJCvbDif9VXOiplGf4-RK0nhw34lvql.zgG73ki0po16f.J4U96ZRvoH3VE_WK';

  //posts
  let correctPostId;
  const correctTitle = 'correctTitle';
  const correctShortDescription = 'correctShortDescription';
  const correctContent = 'correctContent';

  //incorrectData blogs
  const nameLength16 = 'a'.repeat(16);
  const blogWebSiteLength101 = 'a'.repeat(101);
  const blogDescriptionLength501 = 'a'.repeat(501);

  //incorrectData posts
  const titleLength31 = 'a'.repeat(31);
  const postShortDescriptionLength101 = 'a'.repeat(101);
  const postContentLength1001 = 'a'.repeat(1001);

  describe(`/blogs (POST) - create blog`, () => {
    beforeAll(async () => {
      await deleteAllDataTest(httpServer);

      user = await createCorrectUserTest(httpServer);
      const result = await loginCorrectUserTest(httpServer);
      accessToken = result.accessToken;
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
        nameLength16,
        blogDescriptionLength501,
        blogWebSiteLength101,
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
      expect(result.body).toEqual(
        createResponseSingleBlog(
          result.body.id,
          correctBlogName,
          correctDescription,
          correctWebsiteUrl,
        ),
      );
    });
  });

  describe(`/blogs (GET) - get all blogs`, () => {
    beforeAll(async () => {
      await deleteAllDataTest(httpServer);

      user = await createCorrectUserTest(httpServer);
      const result = await loginCorrectUserTest(httpServer);
      accessToken = result.accessToken;
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

  describe(`/blogs/:id (PUT) - update blog by id`, () => {
    beforeAll(async () => {
      await deleteAllDataTest(httpServer);

      user = await createCorrectUserTest(httpServer);
      const result = await loginCorrectUserTest(httpServer);
      accessToken = result.accessToken;

      const blog = await createCorrectBlogTest(httpServer, accessToken);
      correctBlogId = blog.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await updateBlogBloggerTest(
        httpServer,
        correctBlogId,
        'IncorrectJWT',
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (400) values of 'name', 'website' and 'description' are incorrect (large length)
              - (400) values of 'name' (not string), 'website' (incorrect format) and 'description' (not string) are incorrect`, async () => {
      const result1 = await updateBlogBloggerTest(
        httpServer,
        correctBlogId,
        accessToken,
        nameLength16,
        blogDescriptionLength501,
        blogWebSiteLength101,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(
        createErrorsMessageTest(['name', 'description', 'websiteUrl']),
      );

      const result2 = await updateBlogBloggerTest(
        httpServer,
        correctBlogId,
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

    it(`- (403) shouldn't update blog if the blog doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await updateBlogBloggerTest(
        httpServer,
        correctBlogId,
        accessToken2,
        nameLength16,
        blogDescriptionLength501,
        blogWebSiteLength101,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    it(`- (404) should not update blog because blog is not found with such id`, async () => {
      const result = await updateBlogBloggerTest(
        httpServer,
        new ObjectId(),
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`+ (204) should update blog`, async () => {
      const result = await updateBlogBloggerTest(
        httpServer,
        correctBlogId,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //check blog with updating data
      const blog = await getBlogByIdPublicTest(httpServer, correctBlogId, '');
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      expect(blog.body).toEqual(
        createResponseSingleBlog(
          correctBlogId,
          correctBlogName,
          correctDescription,
          correctWebsiteUrl,
        ),
      );
    });
  });

  describe(`/blogs/:id (DELETE) - delete blog by id`, () => {
    beforeAll(async () => {
      await deleteAllDataTest(httpServer);

      user = await createCorrectUserTest(httpServer);
      const result = await loginCorrectUserTest(httpServer);
      accessToken = result.accessToken;

      const blog = await createCorrectBlogTest(httpServer, accessToken);
      correctBlogId = blog.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await deleteBlogBloggerTest(
        httpServer,
        correctBlogId,
        'IncorrectJWT',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (403) shouldn't delete blog if the blog doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await deleteBlogBloggerTest(
        httpServer,
        correctBlogId,
        accessToken2,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    it(`- (404) should not delete blog because blog doesn't exist with such id`, async () => {
      const result = await deleteBlogBloggerTest(
        httpServer,
        new ObjectId(),
        accessToken,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`+ (204) should delete blog`, async () => {
      const result = await deleteBlogBloggerTest(
        httpServer,
        correctBlogId,
        accessToken,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //check that blog is deleted
      const blog = await getBlogByIdPublicTest(httpServer, correctBlogId, '');
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });
  });

  describe(`/blogs/:id/posts (POST) - create post by blogId`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        correctLogin,
        correctPass,
        correctEmail,
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result = await loginUserTest(
        httpServer,
        user.body.login,
        'correctPass',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      accessToken = result.body.accessToken;

      const blog = await createBlogTest(
        httpServer,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      correctBlogId = blog.body.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await createPostTest(
        httpServer,
        correctBlogId,
        'IncorrectJWT',
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (404) should not create post because blog doesn't exist with such id`, async () => {
      const result = await createPostTest(
        httpServer,
        new ObjectId(),
        accessToken,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`- (400) values of 'title', 'shortDescription' and 'content' are incorrect (large length)
              - (400) values of 'title', 'shortDescription' and 'content' are incorrect (not string)`, async () => {
      const result1 = await createPostTest(
        httpServer,
        correctBlogId,
        accessToken,
        titleLength31,
        postShortDescriptionLength101,
        postContentLength1001,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(
        createErrorsMessageTest(['title', 'shortDescription', 'content']),
      );

      const result2 = await createPostTest(
        httpServer,
        correctBlogId,
        accessToken,
        null,
        null,
        null,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result2.body).toEqual(
        createErrorsMessageTest(['title', 'shortDescription', 'content']),
      );
    });

    it(`- (403) shouldn't create post if the blog doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await createPostTest(
        httpServer,
        correctBlogId,
        accessToken2,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    it(`+ (201) should create post`, async () => {
      const result = await createPostTest(
        httpServer,
        correctBlogId,
        accessToken,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      expect(result.body).toEqual(
        createResponseSinglePost(
          correctTitle,
          correctShortDescription,
          correctContent,
          correctBlogId,
        ),
      );
    });
  });

  describe(`/blogs/:id/posts (GET) - get all posts of the blog`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        correctLogin,
        correctPass,
        correctEmail,
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result = await loginUserTest(
        httpServer,
        user.body.login,
        'correctPass',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      accessToken = result.body.accessToken;

      const blog = await createBlogTest(
        httpServer,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      correctBlogId = blog.body.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await getAllPostsTest(
        httpServer,
        correctBlogId,
        'IncorrectJWT',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (404) should not return posts because blog is not found`, async () => {
      const result = await getAllPostsTest(
        httpServer,
        new ObjectId(),
        accessToken,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`- (403) shouldn't return posts if the blog doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await getAllPostsTest(
        httpServer,
        correctBlogId,
        accessToken2,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    //todo query + banned
    it(`+ (200) should return empty array of posts`, async () => {
      const result = await getAllPostsTest(
        httpServer,
        correctBlogId,
        accessToken,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      expect(result.body).toEqual(createResponseAllBlogsTest(1, 1, 10, 0, []));
    });
  });

  describe(`/blogs/:id/posts/:id (PUT) - update post by blogId and postId`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      user = await createUserTest(
        httpServer,
        correctLogin,
        correctPass,
        correctEmail,
      );
      expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result = await loginUserTest(
        httpServer,
        user.body.login,
        'correctPass',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      accessToken = result.body.accessToken;

      const blog = await createBlogTest(
        httpServer,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      correctBlogId = blog.body.id;

      const post = await createPostTest(
        httpServer,
        correctBlogId,
        accessToken,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(post.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      correctPostId = post.body.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await updatePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        'IncorrectJWT',
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (404) should not update post because blog is not found with such id
              - (404) should not update post because post is not found with such id`, async () => {
      //blogId is incorrect
      const result1 = await updatePostTest(
        httpServer,
        new ObjectId(),
        correctPostId,
        accessToken,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
      //postId is incorrect
      const result2 = await updatePostTest(
        httpServer,
        correctBlogId,
        new ObjectId(),
        accessToken,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`- (403) shouldn't update post if the blog of this post doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await updatePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken2,
        correctTitle,
        correctShortDescription,
        correctContent,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    it(`- (400) values of 'title', 'shortDescription' and 'content' are incorrect (large length)
              - (400) values of 'title', 'shortDescription' and 'content' are incorrect (not string)`, async () => {
      const result1 = await updatePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken,
        titleLength31,
        postShortDescriptionLength101,
        postContentLength1001,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result1.body).toEqual(
        createErrorsMessageTest(['title', 'shortDescription', 'content']),
      );

      const result2 = await updatePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken,
        null,
        null,
        null,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.BAD_REQUEST_400);
      expect(result2.body).toEqual(
        createErrorsMessageTest(['title', 'shortDescription', 'content']),
      );
    });

    it(`+ (204) should update post`, async () => {
      const result = await updatePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken,
        'newTitle',
        'newShortDescription',
        'newContent',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //check post with updating data
      const post = await getPostByIdPublicTest(httpServer, correctPostId, '');
      expect(post.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      expect(post.body).toEqual(
        createResponseSinglePost(
          'newTitle',
          'newShortDescription',
          'newContent',
          correctBlogId,
        ),
      );
    });
  });

  describe(`/blogs/:id/posts/:id (DELETE) - delete post by blogId and postId`, () => {
    beforeAll(async () => {
      await deleteAllDataTest(httpServer);
      //const result = await createUserBlogPostTest(httpServer);

      //accessToken = result.accessToken;
      // correctBlogId = result.blog.id;
      //correctPostId = result.post.id;
    });

    it(`- (401) jwt access token is incorrect`, async () => {
      //jwt is incorrect
      const result = await deletePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        'IncorrectJWT',
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    });

    it(`- (404) should not delete post because blog is not found with such id
              - (404) should not delete post because post is not found with such id`, async () => {
      //blogId is incorrect
      const result1 = await deletePostTest(
        httpServer,
        new ObjectId(),
        correctPostId,
        accessToken,
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
      //postId is incorrect
      const result2 = await deletePostTest(
        httpServer,
        correctBlogId,
        new ObjectId(),
        accessToken,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });

    it(`- (403) shouldn't delete post if the blog of this post doesn't belong to current user`, async () => {
      //creates new user
      const newUser = await createUserTest(
        httpServer,
        'user2',
        'correctPass',
        'email2@gmail.com',
      );
      expect(newUser.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);

      const result1 = await loginUserTest(
        httpServer,
        newUser.body.login,
        'correctPass',
      );
      expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
      const accessToken2 = result1.body.accessToken;

      //403 (update blog that doesn't belong this user
      const result2 = await deletePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken2,
      );
      expect(result2.statusCode).toBe(HTTP_STATUS_CODE.FORBIDDEN_403);
    });

    it(`+ (204) should delete post`, async () => {
      const result = await deletePostTest(
        httpServer,
        correctBlogId,
        correctPostId,
        accessToken,
      );
      expect(result.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);

      //check that post is deleted
      const post = await getPostByIdPublicTest(httpServer, correctPostId, '');
      expect(post.statusCode).toBe(HTTP_STATUS_CODE.NOT_FOUND_404);
    });
  });

  describe(`/blogs/comments (GET) - get all comments of the blogger`, () => {
    beforeAll(async () => {
      await request(httpServer)
        .delete('/hometask-nest/testing/all-data')
        .expect(HTTP_STATUS_CODE.NO_CONTENT_204);

      //todo можно вынести
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

      const blog = await createBlogTest(
        httpServer,
        accessToken,
        correctBlogName,
        correctDescription,
        correctWebsiteUrl,
      );
      expect(blog.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
      correctBlogId = blog.body.id;
    });
  });
});
