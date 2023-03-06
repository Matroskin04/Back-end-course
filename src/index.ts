import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express()
const port = 3000

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
type errorObjType = { "message": string, "field": string };
type errorArrType = Array<errorObjType>;
type errorType = { "errorsMessages": errorArrType };
type errorFinal = Array<errorType>;

let allVideos: allVideosType = [];
let allErrors: errorFinal= [];
const createdAt = new Date().toISOString();
const publicationDate = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
const availableResolutions = ['P144', 'P240', 'P360', 'P480',
    'P720', 'P1080', 'P1440', 'P2160']

const parserMiddeleware = bodyParser({})
app.use(parserMiddeleware)

const checkError = (req: Request) => {
    if (req.body.title?.length > 40) {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'The string must be less than 40 characters',
                    "field": 'title'
                }
            ]
        })
    }
    if (typeof req.body.title !== 'string') {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'The type must be string',
                    "field": 'title'
                }
            ]
        })
    }
    if (req.body.author?.length > 20) {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'The string must be less than 20 characters',
                    "field": 'author'
                }
            ]
        })
    }
    if (typeof req.body.author !== 'string') {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'The type must be string',
                    "field": 'author'
                }
            ]
        })
    }
    if (!req.body.availableResolutions.every((p: string) => availableResolutions.includes(p))) {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'availableResolutions must contain variants from suggested',
                    "field": 'availableResolutions'
                }
            ]
        })
    }
    if (req.body.minAgeRestriction?.length > 18 || req.body.minAgeRestriction?.length < 1) {
        allErrors.push({
            "errorsMessages": [
                {
                    "message": 'Length must be from 1 to 18 characters',
                    "field": 'minAgeRestriction'
                }
            ]
        })
    }
}
app.get('/', (req: Request, res: Response) => {
    res.send("Hello World!!!")
})
app.get('/hometask-01/videos', (req: Request, res: Response) => {
    res.status(200).send(allVideos)
})
app.post('/hometask-01/videos', (req: Request, res: Response) => {
    checkError(req)
    if (allErrors.length > 0) {
        res.status(400).send(allErrors);
        allErrors = [];
        return;
    } else {
        const newVideo: videoType = {
            "id": allVideos.at(-1) ? allVideos[allVideos.length - 1].id + 1 : 0,
            "title": req.body.title,
            "author": req.body.author,
            "canBeDownloaded": req.body.canBeDownloaded ?? false,
            "minAgeRestriction": req.body.minAgeRestriction ?? null,
            "createdAt": createdAt,
            "publicationDate": publicationDate,
            "availableResolutions": req.body.availableResolutions
        };
        allVideos.push(newVideo);
        res.status(201).send(newVideo);
    }
})
app.get('/hometask-01/videos/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            res.status(200).send(key);
            return;
        }
    }
    res.send(404)
})
app.put('/hometask-01/videos/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            checkError(req)
            if (allErrors.length > 0) {
                res.status(400).send(allErrors);
                allErrors = [];
                return;
            } else {
            key.title = req.body.title ?? key.title;
            key.author = req.body.author ?? key.author;
            key.availableResolutions = req.body.availableResolutions ?? key.availableResolutions;
            key.canBeDownloaded = req.body.canBeDownloaded ?? key.canBeDownloaded;
            key.minAgeRestriction = req.body.minAgeRestriction ?? key.minAgeRestriction;
            key.publicationDate = req.body.publicationDate ?? key.publicationDate;
            res.send(204);
            return;
        }
    }
}
    res.send(404)
})
app.delete('/hometask-01/videos/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            allVideos.splice(key.id, 1);
            res.send(204);
            return;
        }
    }
    res.send(404)
})
app.delete('/hometask-01/testing/all-data', (req: Request, res: Response) => {
    allVideos = [];
    res.send(204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})