// import request from 'supertest'
import request = require('supertest')
import {app} from "../../src";

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete('/hometask-01/testing/all-data')
    })

    it('should return 200', async () => {
        await request(app)
            .get('/hometask-01/videos')
            .expect(200, [])
    })

    it('won\'t create video with error in title, 404', async () => {
        await request(app)
            .post('/hometask-01/videos')
            .send({"title": null, "author":"325vvv","availableResolutions":["P144","P240","P720"]})
            .expect(400)
    })
})