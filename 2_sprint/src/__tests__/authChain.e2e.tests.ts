import request from "supertest";
import {app} from "../setting";
import {client} from "../db";

describe('auth All operation, chains: /auth', () => {

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

        await request(app)
            .post(`/hometask-02/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail.ru'})
            .expect(201)
    })

    it(`- POST -> Incorrect: small pass and large login; status: 400;
              - POST -> Incorrect: the password or login is wrong; status: 401;`, async () => {

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Too large 123456789123', password: '1'})
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'The length should be from 3 to 10',
                        field: "loginOrEmail"
                    },
                    {
                        message: 'The length should be from 6 to 20',
                        field: "password"
                    }
                ]
            })

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Someone', password: 'something'})
            .expect(401)
    })

    it(`+ POST -> should login in system with 'login'; status: 204;
              + POST -> should login in system with 'email'; status: 204`, async () => {

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(204);

        await request(app)
            .post(`/hometask-02/auth/login`)
            .send({loginOrEmail: 'dim@mail.ru', password: '123qwe'})
            .expect(204);
    })
})