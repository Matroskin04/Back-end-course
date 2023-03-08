import express from 'express';
import bodyParser from "body-parser";
import {allVideosType, errorObjType, errorType} from "./types";
import {videosRoutes} from "./routes/videos-routes";
import {testingRoutes} from "./routes/testing-routes";

const app = express()
const port = 2342

export let allVideos: allVideosType = [];
export let arrErrors: Array<errorObjType> = [];
export let allErrors: errorType = {errorsMessages: arrErrors};


const parserMiddeleware = bodyParser({})
app.use(parserMiddeleware)

app.use('/hometask-01/videos', videosRoutes)
app.use('/hometask-01/testing/all-data', testingRoutes)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})