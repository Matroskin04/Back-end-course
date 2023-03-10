import {Request, Response, Router} from "express";
import type {bodyType} from '../types'
import {arrErrors, allVideos, allErrors} from "../index";
import {videosRepositories} from "../repositories/videos-repositories";

const now = new Date()
export const createdAt = now.toISOString();
export const publicationDate = new Date(now.setDate(now.getDate() + 1)).toISOString();
export const availableResolutions = ['P144', 'P240', 'P360', 'P480',
    'P720', 'P1080', 'P1440', 'P2160']
export const checkError = (body: bodyType) => {  // тип длля body
    if (typeof body.title !== 'string') {
        arrErrors.push({
                message: 'The type must be string',
                field: 'title'
            }
        )
    } else if (body.title.length > 40) {
        arrErrors.push({
                message: 'The string must be less than 40 characters',
                field: 'title'
            }
        )
    }
    if (typeof body.author !== 'string') {
        arrErrors.push({
                message: 'The type must be string',
                field: 'author'
            }
        )
    } else if (body.author.length > 20) {
        arrErrors.push({
                message: 'The string must be less than 20 characters',
                field: 'author'
            }
        )
    }
    if (typeof body.canBeDownloaded !== 'boolean'
        && typeof body.canBeDownloaded !== 'undefined') {
        arrErrors.push({
                message: 'The type must be boolean',
                field: 'canBeDownloaded'
            }
        )
    }
    if (!body.availableResolutions?.every((p: string) => availableResolutions.includes(p))) {
        arrErrors.push({
                message: 'availableResolutions must contain variants from suggested',
                field: 'availableResolutions'
            }
        )
    }
    if (typeof body.minAgeRestriction !== 'number'
        && typeof body.minAgeRestriction !== 'undefined') {
        arrErrors.push({
                message: 'minAgeRestriction must be number',
                field: 'minAgeRestriction'
            }
        )
    } else if (+body.minAgeRestriction! > 18 || +body.minAgeRestriction! < 1) {
        arrErrors.push({
                message: 'Number must be from 1 to 18 characters',
                field: 'minAgeRestriction'
            }
        )
    }
    if (typeof body.publicationDate !== "string"
        && typeof body.publicationDate !== "undefined") {
        arrErrors.push({
                message: 'publicationDate must be string',
                field: 'publicationDate'
            }
        )
    } else if (typeof body.publicationDate !== "undefined"
        && !/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(body.publicationDate)) {
        arrErrors.push({
                message: 'publicationDate must be Date',
                field: 'publicationDate'
            }
        )
    }
}
export const videosRoutes = Router();
videosRoutes.get('/', (req: Request, res: Response) => {
    res.status(200).send(allVideos)
})
videosRoutes.post('/', (req: Request, res: Response) => {
        const result = videosRepositories.createVideo(req.body)
    if (result === allErrors) {
        res.status(400).send(result);
        arrErrors.length = 0;
        return;
    } else {
        res.status(201).send(result);
    }
})
videosRoutes.get('/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            res.status(200).send(key);
            return;
        }
    }
    res.send(404)
})
videosRoutes.put('/:id', (req: Request, res: Response) => {
    for (let key of allVideos) {
        if (key.id === +req.params.id) {
            checkError(req.body)
            if (arrErrors.length > 0) {
                res.status(400).send(allErrors);            // в начало
                arrErrors.length = 0;
                return
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
videosRoutes.delete('/:id', (req: Request, res: Response) => {
    if (allVideos.length > 0) {
        for (let key of allVideos) {
            if (key.id === +req.params.id) {
                allVideos.splice(key.id, 1);
                res.send(204);
                return;
            }
        }
    }
    res.send(404)
})