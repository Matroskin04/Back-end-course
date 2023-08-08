import { CommentDBType } from '../../domain/comments.db.types';

export type StatusOfLike = 'Like' | 'Dislike' | 'None';

export type CommentsDBType = Array<CommentDBType>;
