import { Request, Response } from 'express';
import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './service/auth-service';
import { ViewAuthModel, ViewTokenModel } from './AuthModels/ViewAuthModels';
import { LoginAuthModel } from './AuthModels/LoginAuthModels';
import { HTTP_STATUS_CODE } from '../helpers/enums/http-status';
import {
  RegisterConfirmAuthModel,
  RegisterResendConfirmAuthModel,
  RegistrationAuthModel,
} from './AuthModels/RegistrationAuthModel';
import { ViewAllErrorsModels } from '../models/ViewAllErrorsModels';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUserId } from './decorators/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';

@Controller('/hometask-nest/auth')
export class AuthController {
  constructor(
    protected jwtService: JwtService,
    // protected devicesService: DevicesService,
    protected authService: AuthService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Get('me')
  async getUserInformation(
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewAuthModel>,
  ) {
    try {
      console.log(userId, 'contr');
      const result = await this.authService.getUserInformation(userId);

      if (result) {
        res.status(HTTP_STATUS_CODE.OK_200).send(result);
      } else {
        res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
      }
    } catch (err) {
      console.log(`Something was wrong. Error: ${err}`);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewTokenModel>,
  ) {
    const result = await this.authService.loginUser(userId);

    if (result) {
      //   await this.devicesService.createNewDevice(
      //     req.socket.remoteAddress || 'unknown',
      //     req.headers['user-agent'] || 'unknown',
      //     result.userId,
      //     result.refreshToken,
      //   );

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      res
        .status(HTTP_STATUS_CODE.OK_200)
        .send({ accessToken: result.accessToken });
    } else {
      res.sendStatus(HTTP_STATUS_CODE.UNAUTHORIZED_401);
    }
  }

  @Post('registration')
  async registerUser(
    @Body() inputRegisterModel: RegistrationAuthModel,
    @Res() res: Response<string>,
  ) {
    await this.authService.registerUser(
      inputRegisterModel.email,
      inputRegisterModel.login,
      inputRegisterModel.password,
    );

    res
      .status(HTTP_STATUS_CODE.NO_CONTENT_204)
      .send(
        'Input data is accepted. Email with confirmation code will be send to passed email address',
      );
  }

  // async confirmEmail(
  //   @Body() inputConfirmationCode: RegisterConfirmAuthModel, //todo Guard validation code
  //   @Res() res: Response<string>,
  // ) {
  //   try {
  //     await this.authService.confirmEmail(req.userId!);
  //     res
  //       .status(HTTP_STATUS_CODE.NO_CONTENT_204)
  //       .send('Email was verified. Account was activated');
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }

  // async resendEmailConfirmation(
  //   @Body() inputEmail: RegisterResendConfirmAuthModel,
  //   @Res() res: Response<string>,
  // ) {
  //   try {
  //     await this.authService.resendConfirmationEmailMessage(
  //       req.userId!,
  //       inputEmail.email,
  //     );
  //     res
  //       .status(HTTP_STATUS_CODE.NO_CONTENT_204)
  //       .send(
  //         'Input data is accepted. Email with confirmation code will be send to passed email address.',
  //       );
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }

  // async newRefreshToken(req: Request, res: Response<string | ViewTokenModel>) {
  //   try {
  //     const tokens = await this.jwtService.changeTokensByRefreshToken(
  //       req.userId!,
  //       req.refreshToken,
  //     );
  //     if (!tokens) {
  //       res
  //         .status(HTTP_STATUS_CODE.BAD_REQUEST_400)
  //         .send('Something was wrong');
  //       return;
  //     }
  //
  //     res.cookie(`refreshToken`, tokens.refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //     });
  //     res
  //       .status(HTTP_STATUS_CODE.OK_200)
  //       .send({ accessToken: tokens.accessToken });
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }

  // async logoutUser(req: Request, res: Response<void>) {
  //   try {
  //     await this.devicesService.deleteDeviceByRefreshToken(req.refreshToken);
  //     res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }

  // async passwordRecovery(
  //   req: RequestWithBody<PasswordRecoveryAuthModel>,
  //   res: Response<string>,
  // ) {
  //   try {
  //     await this.authService.sendEmailPasswordRecovery(req.body.email);
  //     res
  //       .status(HTTP_STATUS_CODE.NO_CONTENT_204)
  //       .send(
  //         'Email with instruction will be send to passed email address (if a user with such email exists)',
  //       );
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }
  //
  // async saveNewPassword(
  //   req: RequestWithBody<NewPasswordAuthModel>,
  //   res: Response<string | ViewAllErrorsModels>,
  // ) {
  //   try {
  //     const result = await this.authService.saveNewPassword(
  //       req.body.newPassword,
  //       req.body.recoveryCode,
  //     );
  //
  //     result === true
  //       ? res
  //           .status(HTTP_STATUS_CODE.NO_CONTENT_204)
  //           .send('New password is saved')
  //       : res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).send(result);
  //   } catch (err) {
  //     console.log(`Something was wrong. Error: ${err}`);
  //   }
  // }
}
