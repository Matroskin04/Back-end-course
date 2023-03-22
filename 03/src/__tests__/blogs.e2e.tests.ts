import {describe} from "node:test";
import request from "supertest";
import {app} from "../app";

const generalBlogInputData = {
    name: "Blog1",
    description: "Fantastic description",
    websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
};



describe('/blogs', () => {

    beforeAll(async () => {
        await request(app).delete('/hometask-02/testing/all-data').expect(204)
    })

    describe('POST requests', () => {

        it('should create new blog without errors', async () => {

            const response = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(generalBlogInputData);

            expect(response.status).toBe(201)
            const newBlog = response.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: generalBlogInputData.name,
                description: generalBlogInputData.description,
                websiteUrl: generalBlogInputData.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            })
        })//взять айди сразу и присвоить переменной

        it('should create new blog without errors', async () => {

            const blogInputData = {
                name: "Blog2",
                description: "Fantastic description2",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData);

            expect(response.status).toBe(201);
        });

        it('should create new blog without errors', async () => {

            const blogInputData = {
                name: "Blog3",
                description: "Fantastic description3",
                websiteUrl: "https://X_KNUz73OyaQyC5mFWT3tOVUms1bLawUwAXd2Utcv.c8NL3uQvj28pqV5f2iG.0KYjO0bYH6EvRIMcomgzMCgHFyXedF"
            };

            const response = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'qwerty')
                .send(blogInputData);

            expect(response.status).toBe(201);
        });


        it('should return status 401: unauthorized', async () => {

            const response = await request(app)
                .post('/hometask-02/blogs')
                .auth('admin', 'wrong_password')
                .send(generalBlogInputData);

            expect(response.status).toBe(401);
        })

        it('should return status 401: unauthorized', async () => {

            const response = await request(app)
                .post('/hometask-02/blogs')
                .auth('wrong_login', 'qwerty')
                .send(generalBlogInputData);

            expect(response.status).toBe(401);
        })

        it('should return status 400 with error: the large length of the name', async () => {

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

        it('should return status 400 with 3 errors: type, incorrect the key, invalid URL', async () => {

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

        it(`should return status 400 with 3 errors : incorrect the key, type, type`, async () => {

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

        it(`should return status 400 with 3 errors: empty string, empty, type`, async () => {

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

        it(`should return status 400 with 2 errors: length, wrong the key`, async () => {

            const blogInputData = {
                name: "   Normal Name          ",
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
        });



        // describe('GET requests', () => {
        //
        //     it('should return All blogs', async () => {
        //
        //         await request(app)
        //             .get(`/hometask-02/blogs/`)
        //             .expect(200, await blogsCollection.find({}, {projection: {_id: 0}}).toArray())
        //     })

            // it('should return the single blog by id', async () => {
            //
            //     const idOfBlog = await blogsCollection.findOne({name: "Blog3"});

            //     if (idOfBlog) {
            //         const id = +idOfBlog.id
            //
            //         const result = await request(app)
            //             .get(`/hometask-02/blogs/${id}`)
            //
            //         expect(result.status).toBe(200)
            //         expect(result.body).toEqual({
            //             id: expect.any(String),
            //             name: "Blog3",
            //             description: "Fantastic description3",
            //             websiteUrl: generalBlogInputData.websiteUrl,
            //             createdAt: expect.any(String),
            //             isMembership: false
            //         })
            //
            //     }
            // })
            //
            // it('should NOT return the single blog by id, status 404', async () => {
            //
            //     const idOfBlog = await blogsCollection.findOne({name: "Blog4"});
            //     if (idOfBlog) {
            //
            //     }
            // })
        });

/*
        describe('GET ALL and GET BY ID', () => {


        it('GET the single blog by id', async () => {
            await request(app)
                .get(`/hometask-02/blogs/${await blogsCollection.findOne({id: "id"})}`)
                .expect(200, allBlogs[0])
        })

    })

    it('POST', async () => {
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

 */
    })