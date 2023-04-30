import {describe} from "node:test";
const request = require("supertest");
import {blogsCollection, client} from "../db";
import {BlogType} from "../repositories/repositories-types/blogs-types-repositories";
import {app} from "../setting";

const generalBlogInputData = {
    name: "Blog1-IT-beard",
    description: "Fantastic description",
    websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
};
const arrayOfBlogs: Array<BlogType | null> = [];
let id: string | undefined


describe('POST: /blogs', () => {


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

    it('+ should create 5 new blogs without errors', async () => {
        //1 blog
        const response1 = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(generalBlogInputData);

        expect(response1.status).toBe(201)

        const newBlog = response1.body
        expect(newBlog).toEqual({
            id: expect.any(String),
            name: generalBlogInputData.name,
            description: generalBlogInputData.description,
            websiteUrl: generalBlogInputData.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        })
        arrayOfBlogs.push(newBlog);

        //2 blog
        const blogInputData2 = {
            name: "Blog2-Incubator",
            description: "Fantastic description2",
            websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        };

        const response2 = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData2);

        expect(response2.status).toBe(201);
        arrayOfBlogs.push(response2.body);

        //3 blog
        const blogInputData3 = {
            name: "Blog3-IT",
            description: "Fantastic description3",
            websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        };

        const response3 = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData3);

        expect(response3.status).toBe(201);
        arrayOfBlogs.push(response3.body);

        //4 blog
        const blogInputData4 = {
            name: "Blog4-Function",
            description: "Fantastic description2",
            websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        };

        const response4 = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData4);

        expect(response4.status).toBe(201);
        arrayOfBlogs.push(response4.body);

        const allBlogs = await blogsCollection.find().toArray()
        expect(allBlogs.length).toBe(4)
    })

    it('- BAD AUTH TOKEN => should return status 401: unauthorized', async () => {

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'wrong_password')
            .send(generalBlogInputData);

        expect(response.status).toBe(401);
    })

    it('- WITHOUT AUTH TOKEN => should return status 401: unauthorized', async () => {

        const response = await request(app)
            .post('/hometask-02/blogs')
            .send(generalBlogInputData);

        expect(response.status).toBe(401);
    })

    it(`- INVALID INPUT BODY DATA => should return status 400 with error:
                    the large length of the name`, async () => {

        const blogInputData = {
            name: "The length is more than 15 symbols",
            description: "Fantastic description",
            websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        };

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData);

        expect(response.status).toBe(400);
        const error = response.body;
        expect(error).toEqual({
            "errorsMessages": [
                {
                    "message": "The name should be sting and its length must be less then 16",
                    "field": "name"
                }
            ]
        })
    })

    it(`- INVALID INPUT BODY DATA => should return status 400 with 3 errors:
         type, incorrect the key, invalid URL`, async () => {

        const blogInputData = {
            name: null,
            descriptio: "Fantastic description",
            websiteUrl: "invalid URL"
        };

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData);

        expect(response.status).toBe(400);
        const error = response.body;
        expect(error).toEqual({
            "errorsMessages": [
                {
                    "message": "It should be a string",
                    "field": "name"
                },
                {
                    "message": "There isn\'t this meaning",
                    "field": "description"
                },
                {
                    "message": "It should be valid URL",
                    "field": "websiteUrl"
                }
            ]
        })
    })

    it(`- INVALID INPUT BODY DATA => should return status 400 with 3 errors:
         incorrect the key, type, type`, async () => {

        const blogInputData = {
            nam: "Normal name",
            description: null,
            websiteUrl: null
        };

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData);

        expect(response.status).toBe(400);
        const error = response.body;
        expect(error).toEqual({
            "errorsMessages": [
                {
                    "message": "There isn\'t this meaning",
                    "field": "name"
                },
                {
                    "message": "It should be a string",
                    "field": "description"
                },
                {
                    "message": "It should be a string",
                    "field": "websiteUrl"
                }
            ]
        })
    })

    it(`- INVALID INPUT BODY DATA => should return status 400 with 3 errors:
         empty string, empty, type`, async () => {

        const blogInputData = {
            name: "            ",
            description: "    ",
            websiteUrl: null
        };

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData);

        expect(response.status).toBe(400);
        const error = response.body;
        expect(error).toEqual({
            "errorsMessages": [
                {
                    "message": "It should not be not empty",
                    "field": "name"
                },
                {
                    "message": "It should not be not empty",
                    "field": "description"
                },
                {
                    "message": "It should be a string",
                    "field": "websiteUrl"
                }
            ]
        })
    })

    it(`- INVALID INPUT BODY DATA => should return status 400 with 2 errors: length, wrong the key`, async () => {

        const blogInputData = {
            name: "         Normal Name          ",
            description: "More then 500 characters. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit end!",
            websiteUr: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
        };

        const response = await request(app)
            .post('/hometask-02/blogs')
            .auth('admin', 'qwerty')
            .send(blogInputData);

        expect(response.status).toBe(400);
        const error = response.body;
        expect(error).toEqual({
            "errorsMessages": [
                {
                    "message": "The description\'s length must be less then 501",
                    "field": "description"
                },
                {
                    "message": "There isn't this meaning",
                    "field": "websiteUrl"
                }
            ]
        })
    })

    it
})