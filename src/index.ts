import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express()
const port = 3002

type videoType = {
    "id": number,
    "title": string,
    "author": string,
    "canBeDownloaded": boolean,
    "minAgeRestriction": any,
    "createdAt": string,
    "publicationDate": string,
    "availableResolutions": Array<string>
};
type allVideosType = Array<videoType>;
type errorObjType = {"message": string, "field": string};
type errorArrType = Array<errorObjType>;
type errorType = {"errorsMessages": errorArrType};

let allVideos: allVideosType= [];
const createdAt = new Date().toISOString();
const publicationDate = new Date(Date.now() + ( 3600 * 1000 * 24)).toISOString();
const availableResolutions = [ 'P144', 'P240', 'P360', 'P480',
    'P720', 'P1080', 'P1440', 'P2160' ]

const parserMiddeleware = bodyParser({})
app.use(parserMiddeleware)

app.get('/hometask-01/videos', (req: Request, res: Response) => {
    res.status(200).send(allVideos)
})
app.post('/hometask-01/videos', (req: Request, res: Response) => {
    if (req.body.title.length > 40) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'The string must be less than 40 characters',
                    "field": 'title'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (typeof req.body.title !== 'string') {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'The type must be string',
                    "field": 'title'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (req.body.author.length > 20) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'The string must be less than 20 characters',
                    "field": 'author'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (typeof req.body.author !== 'string') {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'The type must be string',
                    "field": 'author'
                }
            ]
        };
        res.status(400).send(currentError)
    }else if (req.body.availableResolutions.length === 0) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'availableResolutions must contain any information',
                    "field": 'availableResolutions'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (!req.body.availableResolutions.every((p: string) => availableResolutions.includes(p)) ) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'availableResolutions must contain variants from suggested',
                    "field": 'availableResolutions'
                }
            ]
        };
        res.status(400).send(currentError)
    } else {
        const newVideo: videoType = {
            "id": allVideos[allVideos.length - 1]?.id + 1 || 0,
            "title": req.body.title,
            "author": req.body.author,
            "canBeDownloaded": req.body.canBeDownloaded || null,
            "minAgeRestriction": 5,
            "createdAt": createdAt,
            "publicationDate": publicationDate,
            "availableResolutions": req.body.availableResolutions
        };
        allVideos.push(newVideo);
        res.status(201).send(newVideo);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})