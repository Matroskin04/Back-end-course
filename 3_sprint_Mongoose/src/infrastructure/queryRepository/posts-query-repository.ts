import {PostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {PostTypeWithId, PostViewType} from "../repositories/repositories-types/posts-types-repositories";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../../models/PostsModels/QueryPostModel";
import {variablesForReturn} from "./utils/variables-for-return";
import {QueryBlogModel} from "../../models/BlogsModels/QueryBlogModel";
import {PostsOfBlogPaginationType} from "./query-repository-types/blogs-types-query-repository";
import {PostModel} from "../../domain/posts-schema-model";
import {renameMongoIdPost} from "../../helpers/functions/posts-functions-helpers";
import { injectable } from "inversify";
import {StatusOfLike} from "./query-repository-types/comments-types-query-repository";
import {LikesInfoQueryRepository} from "./likes-info-query-repository";
import {reformNewestLikes} from "./utils/likes-info-functions";


@injectable()
export class PostsQueryRepository {
    constructor(protected likesInfoQueryRepository: LikesInfoQueryRepository) {}

    async getAllPosts(query: QueryPostModel): Promise<PostPaginationType> {

        const searchNameTerm: string | null = query?.searchNameTerm ?? null;
        const paramsOfElems = await variablesForReturn(query);

        const countAllPostsSort = await PostModel
            .countDocuments({title: {$regex: searchNameTerm ?? '', $options: 'i'} });


        const allPostsOnPages = await PostModel
            .find({title: {$regex: searchNameTerm ?? '', $options: 'i'} })
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
        }
    }

    async getPostsOfBlog(blogId: string, query: QueryBlogModel): Promise<null | PostsOfBlogPaginationType> {

        const paramsOfElems = await variablesForReturn(query);
        const countAllPostsSort = await PostModel.countDocuments({blogId: blogId});

        const allPostsOnPages = await PostModel
            .find({blogId: blogId})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize )
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        if ( allPostsOnPages.length === 0 ) return null

        return {
            pagesCount:  Math.ceil(countAllPostsSort / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllPostsSort,
            items: allPostsOnPages.map(p => renameMongoIdPost(p))
        }
    }

    async getPostById(postId: string, userId: ObjectId | null): Promise<null | PostViewType> {

        const post = await PostModel.findOne({_id: new ObjectId(postId)});
        if (!post) {
            return null;
        }

        //set StatusLike
        let myStatus: StatusOfLike = 'None'
        if (userId) {
            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(postId), userId);

            if (likeInfo) {
                myStatus = likeInfo.statusLike;
            }
        }

        //find last 3 Likes
        const newestLikes = await this.likesInfoQueryRepository.getNewestLikesOfPost(new ObjectId(postId));
        const reformedNewestLikes = reformNewestLikes(newestLikes)

        return renameMongoIdPost(post, reformedNewestLikes, myStatus);
    }
}
