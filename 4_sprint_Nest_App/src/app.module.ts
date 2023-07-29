import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BlogsService } from './blogs/application/blogs-service';
import { BlogsQueryRepository } from './blogs/infrastructure/query.repository/blogs-query-repository';
import { BlogsRepository } from './blogs/infrastructure/repository/blogs-repository';
import { Blog, BlogSchema } from './blogs/domain/blogs-schema-model';
import { BlogsController } from './blogs/api/blogs.controller';

const mongoURL =
  process.env.MONGO_URL ||
  `mongodb://0.0.0.0:27017/Website_for_programmers_Nest`;

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(mongoURL),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsQueryRepository, BlogsRepository],
})
export class AppModule {}
