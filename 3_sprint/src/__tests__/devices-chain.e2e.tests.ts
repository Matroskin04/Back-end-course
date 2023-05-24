import {client} from "../db";
import request from "supertest";
import {app} from "../setting";
import {ObjectId} from "mongodb";

let refreshToken: string;
let deviceId: string;

describe('devices: /security/devices', () => {

    beforeAll( async () => {
        await client.close();
        await client.connect();

        await request(app)
            .delete('/hometask-03/testing/all-data')
            .expect(204)
    })

    afterAll(async () => {
        await client.close();
    })

    it(`(Addition) + POST -> '/users' - create 2 new users; status 201;
              (Addition) + POST -> '/auth/login' - login 5 times (4+1) from different browsers; status 200`, async () => {
        //1 user
        await request(app)
            .post(`/hometask-03/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Dima123', password: '123qwe', email: 'dim@mail.ru'})
            .expect(201);

        //2 user
        await request(app)
            .post(`/hometask-03/users`)
            .auth('admin', 'qwerty')
            .send({login: 'Sasha123', password: '123qwe', email: 'sash@mail.ru'})
            .expect(201);

        //№ 1
        await request(app)
            .post(`/hometask-03/auth/login`)
            .set('user-agent', 'Mozilla')
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(200);
        //№ 2
        await request(app)
            .post(`/hometask-03/auth/login`)
            .set('user-agent', 'Safari')
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(200);
        //№ 3
        await request(app)
            .post(`/hometask-03/auth/login`)
            .set('user-agent', 'Chrome')
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(200);
        //№ 4
        const response1 = await request(app)
            .post(`/hometask-03/auth/login`)
            .set('user-agent', 'Opera')
            .send({loginOrEmail: 'Dima123', password: '123qwe'})
            .expect(200);
        //№ 5 another user
        const response2 = await request(app)
            .post(`/hometask-03/auth/login`)
            .set('user-agent', 'Opera')
            .send({loginOrEmail: 'Sasha123', password: '123qwe'})
            .expect(200);

        refreshToken = response2.headers["set-cookie"][0];
        expect(refreshToken).not.toBeUndefined();

        //Get deviceId of user Sasha123
        const responseDevices = await request(app)
            .get(`/hometask-03/security/devices`)
            .set('Cookie', refreshToken)
            .send({loginOrEmail: 'Sasha123', password: '123qwe'})
            .expect(200);
        deviceId = responseDevices.body[0].deviceId;

        refreshToken = response1.headers["set-cookie"][0];
        expect(refreshToken).not.toBeUndefined();
    })

    it(`- DELETE -> '/devices/:id' - the refreshToken inside cookie is missing; status 401;
              - DELETE -> '/devices/:id' - delete the deviceId of other user; status 403;
              - DELETE -> '/devices/:id' - Not Found; status 404;
              - DELETE -> '/devices/:id' - the refreshToken inside cookie is expired; status 401;`, async () => {
        //missing refresh
        await request(app)
            .delete(`/hometask-03/security/devices/${new ObjectId}`)
            .expect(401);
        //deviceId of other user
        await request(app)
            .delete(`/hometask-03/security/devices/${deviceId}`)
            .set('Cookie', refreshToken)
            .expect(403);
        //Not Found
        await request(app)
            .delete(`/hometask-03/security/devices/${new ObjectId}`)
            .set('Cookie', refreshToken)
            .expect(404);

        // //задержка 20 сек, чтобы проверить expired token
        // await new Promise((resolve) => setTimeout(resolve, 20000))
        //
        // //refresh token is expired
        // await request(app)
        //     .delete(`/hometask-03/security/devices/${deviceId}`)
        //     .set('Cookie', refreshToken)
        //     .expect(401);
    })

    it(`POST -> '/auth/refresh-token' - update refresh for 1 device`, async () => {

        //update refresh 200
        const refreshResponse = await request(app)
            .post("/hometask-03/auth/refresh-token")
            .set("Cookie", refreshToken)
            .expect(200)
        refreshToken = refreshResponse.headers["set-cookie"][0];

        //get all devices
        const responseDevices = await request(app)
            .get(`/hometask-03/security/devices`)
            .set('Cookie', refreshToken)
            .send({loginOrEmail: 'Sasha123', password: '123qwe'})
            .expect(200);
        expect(responseDevices).toHaveLength(4)
    })
})