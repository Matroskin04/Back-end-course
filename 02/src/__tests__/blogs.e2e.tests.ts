import {describe} from "node:test";
import request from "supertest";
import {app} from "../app";
import {allBlogs} from "../repositories/blogs-repositories";
import {blog} from "../types";

describe('/blogs', () => {

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
                name: "Blog1",
                description: "Fantastic description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        })
            .expect(201)
    })

    it('GET the single blog by id', async () => {
        await request(app)
            .get(`/hometask-02/blogs/${allBlogs[0].id}`)
            .expect(200, allBlogs[0])
    })

    it('PUT: update 1 blog (elem 0 of array allBlogs)', async () => {
        await request(app)
            .put(`/hometask-02/blogs/${allBlogs[0].id}`)
            .auth('admin', 'qwerty')
            .send({
                name: "string",
                description: "string",
                websiteUrl: "https://samurai.it-incubator.io/lessons/homeworks"
            })
            .expect(204)

        const res = await request(app).get(`/hometask-02/blogs`)
        expect(res.body[0]).toEqual({
            ...allBlogs[0],
            name: "string",
            description: "string",
            websiteUrl: "https://samurai.it-incubator.io/lessons/homeworks"
        })
    })

    it('DELETE the single blog by id', async () => {
        await request(app)
            .delete(`/hometask-02/blogs/${allBlogs[0].id}`)
            .auth('admin', 'qwerty')
            .expect(204)

        await request(app)
            .get('/hometask-02/blogs')
            .expect(200, [])
    })

    it('POST new blog: return ERROR - 401 (unauthorized)', async () => {
        await request(app)
            .post('/hometask-02/blogs')
            .send({
                name: "Blog1",
                description: "Fantastic description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })
            .expect(401)

        await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: "Blog1",
                description: "Fantastic description",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            })
    })

    it('PUT: return ERROR - 401 (unauthorized)', async () => {
        await request(app)
            .put(`/hometask-02/blogs/${allBlogs[0].id}`)
            .send({
                name: "string",
                description: "string",
                websiteUrl: "https://samurai.it-incubator.io/lessons/homeworks"
            })
            .expect(401)
    })

    it('DELETE: return ERROR - 401 (unauthorized', async () => {
        await request(app)
            .delete(`/hometask-02/blogs/${allBlogs[0].id}`)
            .expect(401)

    })

    it('POST: return ERROR - incorrect name, description and websiteUrl', async () => {
        await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send({
                name: "More then 15 symbols 123456789",
                description: null,
                websiteUrl: "Invalid URL"
            })
            .expect(400, {
                errorsMessages: [
                    { message: 'The name should be sting and its length must be less then 16', field: 'name' },
                    { message: 'It should be a string', field: 'description' },
                    { message: 'It should be valid URL', field: 'websiteUrl' },
                ],
            })
    })
})