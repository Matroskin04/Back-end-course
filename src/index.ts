import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

const app = express()
const port = 3001

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

let allVideos: allVideosType = [];
const createdAt = new Date().toISOString();
const publicationDate = new Date(Date.now() + (3600 * 1000 * 24)).toISOString();
const availableResolutions = ['P144', 'P240', 'P360', 'P480',
    'P720', 'P1080', 'P1440', 'P2160']

const parserMiddeleware = bodyParser({})
app.use(parserMiddeleware)
app.get('/', (req: Request, res: Response) => {
    res.send("Hello!")
})

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
    } else if (req.body.availableResolutions.length === 0) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'availableResolutions must contain any information',
                    "field": 'availableResolutions'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (!req.body.availableResolutions.every((p: string) => availableResolutions.includes(p))) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'availableResolutions must contain variants from suggested',
                    "field": 'availableResolutions'
                }
            ]
        };
        res.status(400).send(currentError)
    } else if (req.body.minAgeRestriction?.length > 18 || req.body.minAgeRestriction?.length < 1) {
        let currentError: errorType = {
            "errorsMessages": [
                {
                    "message": 'Length must be from 1 to 18 characters',
                    "field": 'minAgeRestriction'
                }
            ]
        };
        res.status(400).send(currentError)
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
    res.send(400)
})
app.put('/hometask-01/videos/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
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
            } else if (req.body.availableResolutions.length === 0) {
                let currentError: errorType = {
                    "errorsMessages": [
                        {
                            "message": 'availableResolutions must contain any information',
                            "field": 'availableResolutions'
                        }
                    ]
                };
                res.status(400).send(currentError)
            } else if (!req.body.availableResolutions.every((p: string) => availableResolutions.includes(p))) {
                let currentError: errorType = {
                    "errorsMessages": [
                        {
                            "message": 'availableResolutions must contain variants from suggested',
                            "field": 'availableResolutions'
                        }
                    ]
                };
                res.status(400).send(currentError)
            } else if (typeof req.body.minAgeRestriction !== 'number'
                        || req.body.minAgeRestriction > 18
                        || req.body.minAgeRestriction < 1) {
                let currentError: errorType = {
                    "errorsMessages": [
                        {
                            "message": 'Number must be from 1 to 18 characters',
                            "field": 'minAgeRestriction'
                        }
                    ]
                };
                res.status(400).send(currentError)
            } else if (typeof req.body.canBeDownloaded !== 'boolean') {
                let currentError: errorType = {
                    "errorsMessages": [
                        {
                            "message": 'canBeDownloaded must be boolean',
                            "field": 'canBeDownloaded'
                        }
                    ]
                };
                res.status(400).send(currentError)
            } else if (typeof req.body.publicationDate !== 'string') {
                let currentError: errorType = {
                    "errorsMessages": [
                        {
                            "message": 'publicationDate must be string',
                            "field": 'publicationDate'
                        }
                    ]
                };
                res.status(400).send(currentError)
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
app.get('/hometask-01/videos/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            allVideos.splice(key.id, 1);
            res.send(204);
            return;
        }
    }
    res.send(404)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})