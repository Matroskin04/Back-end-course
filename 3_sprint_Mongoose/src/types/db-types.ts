import {UserType} from "../repositories/repositories-types/users-types-repositories";
import {ObjectId} from "mongodb";
import {PostType} from "../repositories/repositories-types/posts-types-repositories";
import {CommentType} from "../repositories/repositories-types/comments-types-repositories";
import {BlogType} from "../repositories/repositories-types/blogs-types-repositories";
import {InfoRequestType} from "../repositories/repositories-types/info-request-types-repository";
import {DeviceType} from "../repositories/repositories-types/devices-types-repositories";

export type UserDBType = UserType & {_id: ObjectId};

export type PostDBType = PostType & {_id: ObjectId};

export type CommentDBType = CommentType & {_id: ObjectId};

export type BlogDBType = BlogType & {_id: ObjectId};

export type InfoRequestDBType = InfoRequestType & {_id: ObjectId};
export type DeviceDBType = DeviceType & {_id: ObjectId}

