import { ObjectId } from 'mongodb';

export class CommentDBType {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: {
      userId: string;
      userLogin: string;
    },
    public createdAt: string,
    public postId: string,
    public likesInfo: {
      likesCount: number;
      dislikesCount: number;
    },
  ) {}
}
