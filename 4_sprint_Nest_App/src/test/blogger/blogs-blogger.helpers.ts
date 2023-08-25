import request from 'supertest';

export async function createBlogTest(
  httpServer,
  accessToken: string,
  name,
  description,
  websiteUrl,
) {
  return request(httpServer)
    .post('/hometask-nest/blogger/blogs')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      name,
      description,
      websiteUrl,
    });
}

export async function getAllBlogsBloggerTest(httpServer, accessToken, query) {
  return request(httpServer)
    .get(`/hometask-nest/blogger/blogs`)
    .set('Authorization', `Bearer ${accessToken}`)
    .query(query);
}

export function createResponseAllBlogsTest(
  pagesCount,
  page,
  pageSize,
  totalCount,
  items,
) {
  return {
    pagesCount,
    page,
    pageSize,
    totalCount,
    items,
  };
}
