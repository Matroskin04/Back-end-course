import {describe} from "node:test";
import {client} from "../db";
import request from "supertest";
import {app} from "../setting";
import {UserDBType} from "../repositories/repositories-types/users-types-repositories";

let idOfUser: string;
const arrayOfUser: Array<UserDBType> = [];

describe('users All operation, chains: /users', () => {

    beforeAll(async () => {
        await client.close();
        await client.connect();

        await request(app)
            .delete('/hometask-02/testing/all-data')
            .expect(204)
    });

    afterAll(async () => {
        await client.close();
    })

    it(`- POST -> Unauthorized, status: 401;
              - POST -> small length of password and login, status: 400
              - POST -> incorrect email; status: 40`, async () => {

        await request(app)
            .post(`/hometask-02/users`)
            .send({login: 'Dima', password: '123qwe', email: 'dim@mail.ru'})
            .expect(401)

        await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'D', password: '1', email: 'dim@mail.ru'})
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'The length should be from 3 to 10 characters',
                        field: "login"
                    },
                    {
                        message: 'The length should be from 6 to 20 characters',
                        field: "password"
                    }
                ]
            })

        const response = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail'})
            .expect(400)

        expect(response.body).toEqual({
                errorsMessages: [
                    {
                        message: expect.any(String),
                        field: "email"
                    }
                ]
            })
    })

   it(`+ POST -> should create 3 new users, status: 201;
             - GET -> Unauthorized, status 200
             + GET -> should return all users, status 200`, async () => {

       //1
        const user1 = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail.ru'})
            .expect(201)
       expect(user1.body).toEqual({
           id: expect.any(String),
           login: 'Dima123',
           createdAt: expect.any(String),
           email: 'dim@mail.ru'})
       arrayOfUser.push(user1.body)

       //2
       const user2 = await request(app)
           .post(`/hometask-02/users`)
           .auth('admin', 'qwerty')
           .send({login: 'Matvey123', password: '123qwe', email: 'matv@mail.ru'})
           .expect(201)
       arrayOfUser.push(user2.body)

       //3
       const user3 = await request(app)
           .post(`/hometask-02/users`)
           .auth('admin', 'qwerty')
           .send({login: 'Egor123', password: '123qwe', email: 'egor@mail.ru'})
           .expect(201)
       arrayOfUser.push(user3.body)


       await request(app)
           .get(`/hometask-02/users`)
           .expect(401)

        const responseGet = await request(app)
            .get(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [arrayOfUser[2],arrayOfUser[1],arrayOfUser[0]]
            })

       idOfUser = user1.body.id
    })

    it(`QUERY-PAGINATION:
             + GET -> '/users': sortBy=login + sortDirection=asc, status 200
             + GET -> should return all users, status 200`, async () => {

        //1
        const user1 = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail.ru'})
            .expect(201)
        expect(user1.body).toEqual({
            id: expect.any(String),
            login: 'Dima123',
            createdAt: expect.any(String),
            email: 'dim@mail.ru'})
        arrayOfUser.push(user1.body)

        //2
        const user2 = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Matvey123', password: '123qwe', email: 'matv@mail.ru'})
            .expect(201)
        arrayOfUser.push(user2.body)

        //3
        const user3 = await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Egor123', password: '123qwe', email: 'egor@mail.ru'})
            .expect(201)
        arrayOfUser.push(user3.body)


        await request(app)
            .get(`/hometask-02/users`)
            .expect(401)

        const responseGet = await request(app)
            .get(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [arrayOfUser[2],arrayOfUser[1],arrayOfUser[0]]
            })

        idOfUser = user1.body.id
    })

    it(`- DELETE -> Unauthorized, status: 401;
              + DELETE -> should delete the user, status: 204;
              - DELETE -> should NOT find the user, status 404`, async () => {

        await request(app)
            .delete(`/hometask-02/users/${idOfUser}`)
            .expect(401)

        await request(app)
            .delete(`/hometask-02/users/${idOfUser}`)
            .auth('admin', 'qwerty')
            .expect(204)

        await request(app)
            .delete(`/hometask-02/users/${idOfUser}`)
            .auth('admin', 'qwerty')
            .expect(404)
    })
})