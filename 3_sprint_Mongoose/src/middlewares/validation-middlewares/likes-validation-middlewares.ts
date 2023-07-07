import {body} from "express-validator";

export const validateBodyOfLikeStatus = [

    body('likeStatus')
        .exists()
        .withMessage('There isn\'t value')

        .isIn(['None', 'Like', 'Dislike'])
        .withMessage('The value should be one of the following: None, Like, Dislike')
]