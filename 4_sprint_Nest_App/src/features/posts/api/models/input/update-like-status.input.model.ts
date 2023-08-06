import { LikeStatus } from '../../../../../infrastructure/helpers/enums/like-status';
import { IsEnum } from 'class-validator';

export class UpdatePostLikeStatusModel {
  @IsEnum(['Like', 'Dislike', 'None'], {
    message: 'The value should be one of these: None, Like, Dislike',
  })
  likeStatus: LikeStatus;
}
