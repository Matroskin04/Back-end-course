import {describe} from "node:test";
import request from "supertest";
import {app} from "../02H_W";

describe('/blogs', () => {

    // let newBlog: blog | null

    beforeAll(async () => {
        await request(app).delete('/hometask-02/testing/all-data').expect(204)
    })

    it('GET allBlogs = [] with status 200', async () => {
        await request(app).get('/hometask-02/blogs').expect(200, [])
    })

    it('POST new blog. Return new blog with status 201', async () => {
        await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: "string",
                description: "string",
                websiteUrl: "https://grgQytO1gr1dZ9HXqtudJo0G.YEkYu64cTqteorBDfYc7jiLp10lSxQiaTW7npYNDqXSfU3tj7sdQ_gLQpEGh99tHAj_"
        })
            .expect(201)
    })
})