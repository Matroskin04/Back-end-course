import { ObjectId } from 'mongodb';

export class CommentsLikesInfoDBType {
  constructor(
    public commentId: ObjectId,
    public userId: ObjectId,
    public statusLike: 'Like' | 'Dislike',
  ) {}
}

export class PostsLikesInfoDBType {
  constructor(
    public postId: ObjectId,
    public userId: ObjectId,
    public login: string,
    public addedAt: string,
    public statusLike: 'Like' | 'Dislike' | 'None',
  ) {}
}
