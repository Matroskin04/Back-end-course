import request from "supertest";
import {app} from "../setting";
import {client} from "../db";
import {ObjectId} from "mongodb";
import {CommentType} from "../repositories/repositories-types/comments-types-repositories";
import {usersQueryRepository} from "../queryRepository/users-query-repository";


let jwt: string;
let idOfUser: ObjectId | null = null;
let idOfPost: ObjectId | null = null;
let idOfComment: ObjectId | null = null;
let confirmationCode: string | null = null;
const arrayOfComments: Array<CommentType> = []

describe('auth+comments All operation, chains: /auth + /posts/{id}/comments + /comments', () => {

    beforeAll( async () => {
        await client.close();
        await client.connect();

        await request(app)
            .delete('/hometask-02/testing/all-data')
            .expect(204)
    })

    afterAll(async () => {
        await client.close();
    })

    it(`(Addition) + POST -> create new user; status 201`, async () => {

        const user = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail.ru'})
            .expect(201);

        idOfUser = user.body.id;
    })

    it(`- POST -> '/login' Incorrect: small pass and large login; status: 400;
              - POST -> '/login' Incorrect: the password or login is wrong; status: 401;`, async () => {

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Too large 123456789123', password: '1'})
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'The length should be from 3 to 10 characters',
                        field: "loginOrEmail"
                    },
                    {
                        message: 'The length should be from 6 to 20 characters',
                        field: "password"
                    }
                ]
            })

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Someone', password: 'something'})
            .expect(401)
    })

    it(`+ POST -> '/login' should login in system with 'login'; status: 200;
              + POST -> '/login' should login in system with 'email'; status: 200`, async () => {

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(200);

        const response = await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'dim@mail.ru', password: '123qwe'})
            .expect(200);
        expect(response.body).toEqual({accessToken: expect.any(String)})

        jwt = response.body.accessToken;
    })

    it(`- GET -> '/me' there isn't JWT token; status: 401;
              + GET -> '/me' should `, async () => {

        await request(app)
            .get(`/hometask-02/auth/me`)
            .expect(401);

        await request(app)
            .get(`/hometask-02/auth/me`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(200, {
                email: "dim@mail.ru",
                login: "Dima123",
                userId: idOfUser
            });
    })

    it(`Addition: + POST -> '/blogs' should create new blog, status 201
                        + POST -> '/posts' should create new post, status 201`, async () => {

        const responseBlog = await request(app)
            .post(`/hometask-02/blogs`)
            .auth('admin', 'qwerty')
            .send({
                name: "Blog2-ITforYOU",
                description: "some information",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            }).expect(201);

        const responsePost = await request(app)
            .post(`/hometask-02/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: "post 1",
                shortDescription: "something interesting",
                content: "content of the post",
                blogId: responseBlog.body.id
            }).expect(201);

        idOfPost = responsePost.body.id;
    })

    it(`- POST -> '/posts/{id}/comments' Unauthorized; status: 401;
              - POST -> '/posts/{id}/comments' Incorrect Input body: small length of the content; status: 400
              - POST -> '/posts/{id}/comments' Incorrect Input body: there isn't such value; status: 400
              - POST -> '/posts/{id}/comments' Incorrect Input body: the content isn't a string; status: 400`, async () => {

        await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .expect(401);

        const response1 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'small'})
            .expect(400);
        expect(response1.body).toEqual({
            "errorsMessages": [{
                "message": expect.any(String),
                "field": "content"
            }]});

        const response2 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({conten: 'normal 12341231241313'})
            .expect(400);
        expect(response2.body).toEqual({
            "errorsMessages": [{
                "message": expect.any(String),
                "field": "content"
            }]})

        const response3 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: null})
            .expect(400);
        expect(response3.body).toEqual({
            "errorsMessages": [{
                "message": expect.any(String),
                "field": "content"
            }]})
    })

    it(`Addition: - POST -> '/posts/{id}/comments' the post with such id doesnt exist; status: 404`, async () => {

        await request(app)
            .post(`/hometask-02/posts/${new ObjectId()}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'normal content12341235123412351235'})
            .expect(404);
    })

    it(`+ POST -> '/posts/{id}/comments' should create 3 new comments; status: 201;
              - GET -> '/posts/{id}/comments' Unauthorized, status 401;
              + GET -> '/posts/{id}/comments' should return 3 comments, status 200`, async () => {

        const comment1 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'super normal content 12341235123412351235'})
            .expect(201);
        expect(comment1.body).toEqual({
            id: expect.any(String),
            content: 'super normal content 12341235123412351235',
            commentatorInfo: {
                userId: idOfUser,
                userLogin: 'Dima123'
            },
            createdAt: expect.any(String)
        });
        arrayOfComments.push(comment1.body);

        const comment2 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'normal content 12341235123412351235'})
            .expect(201);
        arrayOfComments.push(comment2.body);

        const comment3 = await request(app)
            .post(`/hometask-02/posts/${idOfPost}/comments`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'genius content 12341235123412351235'})
            .expect(201);
        arrayOfComments.push(comment3.body);


        await request(app)
            .get(`/hometask-02/posts/${new ObjectId()}/comments`)
            .expect(404);

        await request(app)
            .get(`/hometask-02/posts/${idOfPost}/comments`)
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [arrayOfComments[2],arrayOfComments[1],arrayOfComments[0]]
            });

        idOfComment = comment1.body.id;
    })

    it(`QUERY-PAGINATION
              + GET -> '/posts/{id}/comments' pageNumber=2 + pageSize=2 (default: sortBy=createdAt + sortDirection=desc), status 200;
              + GET -> '/posts/{id}/comments' sortBy=content + sortDirection=asc (default: pageNumber=1 + pageSize=10), status 200`, async () => {

        await request(app)
            .get(`/hometask-02/posts/${idOfPost}/comments`)
            .query('pageNumber=2&pageSize=2')
            .expect(200, {
                pagesCount: 2,
                page: 2,
                pageSize: 2,
                totalCount: 3,
                items: [arrayOfComments[0]]
            });

        await request(app)
            .get(`/hometask-02/posts/${idOfPost}/comments`)
            .query('sortBy=content&sortDirection=asc')
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [arrayOfComments[2],arrayOfComments[1],arrayOfComments[0]]
            });
    })

    it(`- GET -> '/comments/{id}' Not Found, status 404;
              + GET -> '/comments/{id}' should return the comment by id, status 200`, async () => {

        await request(app)
            .get(`/hometask-02/comments/${new ObjectId()}`)
            .expect(404);

        await request(app)
            .get(`/hometask-02/comments/${idOfComment}`)
            .expect(200, arrayOfComments[0])
    });

    it(`- PUT -> '/comments/{id}' Not Found, status 404;
              - PUT -> '/comments/{id}' Unauthorized, status 401;
              - PUT -> '/comments/{id}' the content is not a string, status 400;
              - PUT -> '/comments/{id}' small length of the content, status 400;
              + PUT -> '/comments/{id}' successfully updated, status 204;`, async () => {

        await request(app)
            .put(`/hometask-02/comments/${new ObjectId()}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'edit content 12341235123412351235'})
            .expect(404);

        await request(app)
            .put(`/hometask-02/comments/${idOfComment}`)
            .send({content: 'edit content 12341235123412351235'})
            .expect(401);

        const response1 = await request(app)
            .put(`/hometask-02/comments/${idOfComment}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: null})
            .expect(400);
        expect(response1.body).toEqual({errorsMessages: [{
                    message: expect.any(String),
                    field: "content" }]
        })

        const response2 = await request(app)
            .put(`/hometask-02/comments/${idOfComment}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'edit'})
            .expect(400);
        expect(response2.body).toEqual({errorsMessages: [{
                message: expect.any(String),
                field: "content" }]
        })

        await request(app)
            .put(`/hometask-02/comments/${idOfComment}`)
            .set('Authorization', `Bearer ${jwt}`)
            .send({content: 'edit content 12341235123412351235'})
            .expect(204);
    })

    it(`- DELETE -> '/comments/{id}' Not Found, status 404;
              - DELETE -> '/comments/{id}' Unauthorized, status 401;
              + DELETE -> '/comments/{id}' the content is not a string, status 204;`, async () => {

        await request(app)
            .delete(`/hometask-02/comments/${new ObjectId()}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(404);

        await request(app)
            .delete(`/hometask-02/comments/${idOfComment}`)
            .expect(401);

        await request(app)
            .delete(`/hometask-02/comments/${idOfComment}`)
            .set('Authorization', `Bearer ${jwt}`)
            .expect(204);
    })

    it(`-POST -> '/auth/registration' login, pass - small length + incorrect email; status: 400;
              -POST -> '/auth/registration' login, pass,email - aren't strings; status: 400;
              +POST -> '/auth/registration' should create new user and send message on email; status: 204;
              -POST -> '/auth/registration' user with the given email already exists; status: 400;
              -POST -> '/auth/registration' user with the given login already exists; status: 400;`, async () => {

        const response1 = await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: "E4",
                password: "123",
                email: 'meschit9gmail.com'
            })
            .expect(400)
        expect(response1.body).toEqual({errorsMessages: [
                {message: expect.any(String), field: "login" },
                {message: expect.any(String), field: "email" },
                {message: expect.any(String), field: "password" },  ]
        })

        const response2 = await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: null,
                password: null,
                email: null
            })
            .expect(400)
        expect(response2.body).toEqual({errorsMessages: [
                {message: expect.any(String), field: "login" },
                {message: expect.any(String), field: "email" },
                {message: expect.any(String), field: "password" },  ]
        })

        await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: 'Egor123',
                password: '123qwe',
                email: 'meschit9@gmail.com'
            })
            .expect(204)

        //Поиск confirmationCode
        const user = await usersQueryRepository.getUserByLoginOrEmail('Egor123');
        confirmationCode = user ? user.emailConfirmation.confirmationCode : null;

        const response4 = await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: 'Egor123',
                password: '123qwe',
                email: 'mfdsft1239@gmail.com'
            })
            .expect(400)
        expect(response4.body).toEqual({errorsMessages: [ {message: expect.any(String), field: "login" }  ] })

        const response5 = await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: 'AnotherLog',
                password: '123qwe',
                email: 'meschit9@gmail.com'
            })
            .expect(400)
        expect(response5.body).toEqual({errorsMessages: [ {message: expect.any(String), field: "email" }  ] })
    })

    it(`+POST -> '/auth/registration-confirmation': Email was verified; status: 204;
              -POST -> '/auth/registration-confirmation': the confirmation code is incorrect; status: 400;
              -POST -> '/auth/registration-confirmation': the confirmation code is already been applied; status: 400;`, async () => {

        await request(app)
            .post(`/hometask-02/auth/registration-confirmation`)
            .send({
                code: confirmationCode
            })
            .expect(204);

        await request(app)
            .post(`/hometask-02/auth/registration-confirmation`)
            .send({
                code: confirmationCode + '1'
            })
            .expect(400);

        await request(app)
            .post(`/hometask-02/auth/registration-confirmation`)
            .send({
                code: confirmationCode
            })
            .expect(400);
    })

    it(`+POST -> '/auth/registration' should create new user and send message on email; status: 204;
              -POST -> '/auth/registration-email-resending': email is already confirmed; status: 400;
              -POST -> '/auth/registration-email-resending': incorrect email; status: 400;
              -POST -> '/auth/registration-email-resending': email is not a string; status: 400;
              +POST -> '/auth/registration-email-resending': successful; status: 204;
              -POST -> '/auth/registration-confirmation': the confirmation code is incorrect (old code); status: 400;
              +POST -> '/auth/registration-confirmation': Email was verified; status: 204;`, async () => {
        //create new user
        await request(app)
            .post(`/hometask-02/auth/registration`)
            .send({
                login: 'Matvey123',
                password: '123qwe',
                email: 'meschit@gmail.com'
            })
            .expect(204)

        //email is already confirmed
        await request(app)
            .post(`/hometask-02/auth/registration-email-resending`)
            .send({
                email: 'meschit9@gmail.com'
            })
            .expect(400);

        //incorrect email
        await request(app)
            .post(`/hometask-02/auth/registration-email-resending`)
            .send({
                email: 'incorrect.ru'
            })
            .expect(400);

        //email is not a string
        await request(app)
            .post(`/hometask-02/auth/registration-email-resending`)
            .send({
                email: null
            })
            .expect(400);

        //successful
        await request(app)
            .post(`/hometask-02/auth/registration-email-resending`)
            .send({
                email: 'meschit@gmail.com'
            })
            .expect(204);

        //the confirmation code is incorrect (old code)
        await request(app)
            .post(`/hometask-02/auth/registration-confirmation`)
            .send({
                code: confirmationCode
            })
            .expect(400);

        //Новый confirmationCode для Matvey123
        const user = await usersQueryRepository.getUserByLoginOrEmail('Matvey123');
        confirmationCode = user ? user.emailConfirmation.confirmationCode : null;

        //Email was verified
        await request(app)
            .post(`/hometask-02/auth/registration-confirmation`)
            .send({
                code: confirmationCode
            })
            .expect(204);
    })
})

// describe(`comments All operation: /posts/{id}/comments + /comments`, () => {
//
//     it(`Addition: + POST -> '/blogs' should create new blog, status 201
//                         + POST -> '/posts' should create new post, status 201`, async () => {
//
//         const responseBlog = await request(app)
//             .post(`/hometask-02/blogs`)
//             .auth('admin', 'qwerty')
//             .send({
//                 name: "Blog2-ITforYOU",
//                 description: "some information",
//                 websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
//             }).expect(201);
//
//         const responsePost = await request(app)
//             .post(`/hometask-02/posts`)
//             .auth('admin', 'qwerty')
//             .send({
//                 title: "post 1",
//                 shortDescription: "something interesting",
//                 content: "content of the post",
//                 blogId: responseBlog.body.id
//             }).expect(201);
//
//         idOfPost = responsePost.body.id;
//         console.log(idOfPost)
//     })
//
//     it(`- POST -> '/posts/{id}/comments' Unauthorized; status: 401;
//               - POST -> '/posts/{id}/comments' Incorrect Input body: small length of the content; status: 400
//               - POST -> '/posts/{id}/comments' Incorrect Input body: there isn't such value; status: 400
//               - POST -> '/posts/{id}/comments' Incorrect Input body: the content isn't a string; status: 400`, async () => {
//
//         await request(app)
//             .post(`/posts/${idOfPost}/comments`)
//             .expect(401);
//
//         const response1 = await request(app)
//             .post(`/posts/${idOfPost}/comments`)
//             .set('Authorization', `Bearer ${jwt}`)
//             .send({content: 'small'})
//             .expect(400);
//         expect(response1.body).toEqual({
//             "errorsMessages": [{
//                     "message": expect.any(String),
//                     "field": "content"
//                 }]});
//
//         const response2 = await request(app)
//             .post(`/posts/${idOfPost}/comments`)
//             .set('Authorization', `Bearer ${jwt}`)
//             .send({conten: 'normal 12341231241313'})
//             .expect(400);
//         expect(response2.body).toEqual({
//             "errorsMessages": [{
//                 "message": expect.any(String),
//                 "field": "conten"
//             }]})
//
//         const response3 = await request(app)
//             .post(`/posts/${idOfPost}/comments`)
//             .set('Authorization', `Bearer ${jwt}`)
//             .send({content: null})
//             .expect(400);
//         expect(response3.body).toEqual({
//             "errorsMessages": [{
//                 "message": expect.any(String),
//                 "field": "content"
//             }]})
//     })
// })