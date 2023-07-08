import {CommentOutputType} from "../repositories/repositories-types/comments-types-repositories";
import {ObjectId} from "mongodb";
import {QueryPostModel} from "../models/PostsModels/QueryPostModel";
import {CommentOfPostPaginationType} from "./query-repository-types/posts-types-query-repository";
import {variablesForReturn} from "./utils/variables-for-return";
import {CommentModel} from "../db/shemasModelsMongoose/comments-schema-model";
import {mappingComment} from "../helpers/functions/comments-functions-helpers";
import {PostsQueryRepository} from "./posts-query-repository";
import {LikesInfoQueryRepository} from "./likes-info-query-repository";


export class CommentsQueryRepository  {
    constructor(protected postsQueryRepository: PostsQueryRepository,
                protected likesInfoQueryRepository: LikesInfoQueryRepository) {}

    async getCommentById(commentId: string): Promise<CommentOutputType | null> {

        const comment = await CommentModel.findOne({_id: new ObjectId(commentId)});
        if (!comment) {
            return null;
        }

        // let myStatus: 'Like' | 'Dislike' | 'None' //todo типизация
        // const likeInfo = await this.likesInfoQueryRepository.getLikesInfoByCommentAndUser(new ObjectId(commentId), new ObjectId(comment.commentatorInfo.userId));
        //
        // if (!likeInfo) {
        //     myStatus = 'None';
        //
        // } else {
        //     myStatus = likeInfo.statusLike;
        // }

        return mappingComment(comment, 'None'); //todo статус кого? У нас нет юзера.
    }

    async getCommentsOfPost(query: QueryPostModel, id: string): Promise<CommentOfPostPaginationType | null> {

        const post = await  this.postsQueryRepository.getSinglePost(id);
        if (!post) {
            return null
        }

        const paramsOfElems = await variablesForReturn(query);

        const countAllCommentsOfPost = await CommentModel
            .countDocuments({postId: id});


        const allCommentOfPostsOnPages = await CommentModel
            .find({postId: id})
            .skip((+paramsOfElems.pageNumber - 1) * +paramsOfElems.pageSize)
            .limit(+paramsOfElems.pageSize)
            .sort(paramsOfElems.paramSort).lean();


        return {
            pagesCount: Math.ceil(countAllCommentsOfPost / +paramsOfElems.pageSize),
            page: +paramsOfElems.pageNumber,
            pageSize: +paramsOfElems.pageSize,
            totalCount: countAllCommentsOfPost,
            items: allCommentOfPostsOnPages.map(p => mappingComment(p, 'None')) //todo статус кого передавать? У нас нет userID
        }
    }
}
