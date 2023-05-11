import {Request} from "express";
import {ObjectId} from "mongodb";
import {UserType} from "../repositories/repositories-types/users-types-repositories";
import {PostType} from "../repositories/repositories-types/posts-types-repositories";
import {CommentType} from "../repositories/repositories-types/comments-types-repositories";
import {BlogType} from "../repositories/repositories-types/blogs-types-repositories";

export type RequestWithQuery<Q> = Request<{},{},{},Q>;
export type RequestWithBody<B> = Request<{},{},B>;
export type RequestWithParams<P> = Request<P>;
export type RequestWithParamsAndBody<P, B> = Request<P,{},B>;
export type RequestWithParamsAndQuery<P, Q> = Request<P,{},{},Q>;


export type refreshTokensDBType = {
    userId: ObjectId
    refreshToken: string
};

export type UserDBType = UserType & {_id: ObjectId};

export type PostDBType = PostType & {_id: ObjectId};

export type CommentDBType = CommentType & {_id: ObjectId};

export type BlogDBType = BlogType & {_id: ObjectId};


