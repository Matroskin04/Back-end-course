import { NewestLikesType } from '../../posts/infrastructure/repository/posts-types-repositories';
import { PostDBType } from '../../posts/domain/posts-db-types';
import { PostViewType } from '../../posts/infrastructure/query.repository/posts-types-query-repository';

export function modifyPostIntoViewModel(
  post: PostDBType,
  newestLikes: NewestLikesType,
  myStatus: 'None' | 'Like' | 'Dislike',
): PostViewType {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus,
      newestLikes,
    },
  };
}

export async function mappingPostForAllDocs( //todo такую логику лучше в функции оставить? Или в инстанс метод
  post: PostDBType,
  // userId: ObjectId | null,
): Promise<PostViewType> {
  // const likesInfoQueryRepository = new LikesInfoQueryRepository();

  const myStatus: 'Like' | 'Dislike' | 'None' = 'None';

  // if (userId) {
  //   const likeInfo = await likesInfoQueryRepository.getLikesInfoByPostAndUser(
  //     post._id,
  //     userId,
  //   );
  //   if (likeInfo) {
  //     myStatus = likeInfo.statusLike;
  //   }
  // }

  // find last 3 Likes
  // const newestLikes = await likesInfoQueryRepository.getNewestLikesOfPost(
  //   post._id,
  // );
  // const reformedNewestLikes = reformNewestLikes(newestLikes);
  const reformedNewestLikes = [
    {
      login: '123',
      userId: '123',
      addedAt: '2023-07-30T09:53:33.591Z',
    },
    {
      login: '123',
      userId: '123',
      addedAt: '2023-07-30T09:53:33.591Z',
    },
    {
      login: '123',
      userId: '123',
      addedAt: '2023-07-30T09:53:33.591Z',
    },
  ];

  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.likesInfo.likesCount,
      dislikesCount: post.likesInfo.dislikesCount,
      myStatus: myStatus,
      newestLikes: reformedNewestLikes,
    },
  };
}
