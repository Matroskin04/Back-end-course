import express from "express"
import {blogsRoutes} from "./routes/blogs-routes";
import bodyParser from 'body-parser'
import {postsRoutes} from "./routes/posts-routes";
import {testingRoutes} from "./routes/testing-routes";
import {runDb} from "./db";

export const app = express()
const port = process.env.PORT || 3000


app.use(bodyParser({}))

app.use('/hometask-02/blogs', blogsRoutes)
app.use('/hometask-02/posts', postsRoutes)
app.use('/hometask-02/testing/all-data', testingRoutes)

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()
