import express, {Request, Response} from "express"
import {blogsRoutes} from "./routes/blogs-routes";
import bodyParser from 'body-parser'
import {postsRoutes} from "./routes/posts-routes";
import {testingRoutes} from "./routes/testing-routes";

const app = express()
const port = 3000


app.use(bodyParser({}))
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})
app.use('/hometask-02/blogs', blogsRoutes)
app.use('/hometask-02/posts', postsRoutes)
app.use('/hometask-02/all-data', testingRoutes)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
