import express from "express";
import bodyParser from "body-parser";
import {blogsRoutes} from "./routes/blogs-routes";
import {postsRoutes} from "./routes/posts-routes";
import {usersRoutes} from "./routes/users-routes";
import {authRoutes} from "./routes/auth-routes";
import {testingRoutes} from "./routes/testing-routes";


export const privateKey = process.env.PRIVATE_KEY || 'testingKey123' // todo куда
export const app = express()

app.use(bodyParser({}))

app.use('/hometask-02/blogs', blogsRoutes)
app.use('/hometask-02/posts', postsRoutes)
app.use('/hometask-02/users', usersRoutes)
app.use('/hometask-02/auth', authRoutes)
app.use('/hometask-02/testing/all-data', testingRoutes)