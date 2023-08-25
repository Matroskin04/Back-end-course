import request from 'supertest';

export async function createPostTest(
  httpServer,
  blogId,
  accessToken,
  title,
  shortDescription,
  content,
) {
  return request(httpServer)
    .post(`/hometask-nest/blogger/blogs/${blogId}/posts`)
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title,
      shortDescription,
      content,
    });
}

export async function getAllPostsTest(httpServer, blogId, accessToken) {
  return request(httpServer)
    .get(`/hometask-nest/blogger/blogs/${blogId}/posts`)
    .set('Authorization', `Bearer ${accessToken}`);
}

export function createResponseSinglePost(
  title,
  shortDescription,
  content,
  blogId,
) {
  return {
    id: expect.any(String),
    title,
    shortDescription,
    content,
    blogId,
    blogName: expect.any(String),
    createdAt: expect.any(String),
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    },
  };
}
