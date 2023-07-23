import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../../models/PostsModels/QueryPostModel";
import {CommentOfPostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {variablesForReturn} from "./utils/variables-for-return";
import {CommentModel} from "../../domain/comments-schema-model";
import {mappingComment, mappingCommentForAllDocs} from "../../helpers/functions/comments-functions-helpers";
import {PostsQueryRepository} from "./posts-query-repository";
import {LikesInfoQueryRepository} from "./likes-info-query-repository";
import {StatusOfLike} from "./query-repository-types/comments-types-query-repository";
import { injectable } from "inversify";


@injectable()
export class CommentsQueryRepository  {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected likesInfoQueryRepository: LikesInfoQueryRepository) {}

    async getCommentById(commentId: string, userId: ObjectId | null): Promise<CommentOutputType | null> {

        const comment = await CommentModel.findOne({_id: new ObjectId(commentId)});
        if (!comment) {
            return null;
        }

        let myStatus: StatusOfLike = 'None'
        if (userId) {
            const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(commentId), userId);

            if (likeInfo) {
                myStatus = likeInfo.statusLike;
            }
        }

        return mappingComment(comment, myStatus);
    }

    async getCommentsOfPost(query: QueryPostModel, id: string, userId: ObjectId | null): Promise<CommentOfPostPaginationType | null> {

        const post = await this.postsQueryRepository.getSinglePost(id);
        if (!post) {
            return null
        }

        const paramsOfElems = await variablesForReturn(query);

        const countAllCommentsOfPost = await CommentModel
            .countDocuments({postId: id});


        const allCommentsOfPostOnPages = await CommentModel
            .find({postId: id})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();

        const allCommentsOfPost = await Promise.all(allCommentsOfPostOnPages.map(async p => mappingCommentForAllDocs(p, userId)));


        return {
            pagesCount: Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllCommentsOfPost,
            items: allCommentsOfPost
        }
    }
}
