import express, {Request, Response} from 'express'
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
type errorArrType = [{"message": string, "field": string}];
type errorType = {"errorsMessages": errorArrType};

let allVideos: allVideosType= []
const createdAt = new Date().toISOString();
const publicationDate = new Date(Date.now() + ( 3600 * 1000 * 24)).toISOString();
const availableResolutions = [ 'P144', 'P240', 'P360', 'P480',
                                'P720', 'P1080', 'P1440', 'P2160' ]

app.get('/hometask-01/videos', (req: Request, res: Response) => {
    res.status(200).send(allVideos)
})
app.post('/hometask-01/videos', (req: Request, res: Response) => {
    if (req.body.availableResolutions.each((p: string) => availableResolutions.includes(p))
        && req.body.title < 41 && req.body.author.length < 21) {
        const newVideo: videoType = {
            "id": allVideos[allVideos.length - 1]?.id + 1 || 0,
            "title": req.body.title,
            "author": req.body.author,
            "canBeDownloaded": true,
            "minAgeRestriction": 5,
            "createdAt": createdAt,
            "publicationDate": publicationDate,
            "availableResolutions": req.body.availableResolutions
        }
        res.status(201).send(newVideo)
    } else {
        let error: errorType = {
            "errorsMessages": [
                {
                    "message": "string",
                    "field": "string"
                }
            ]
        }
        res.status(400).send(error)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})