import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './service/auth-service';
import { ViewAuthModel, ViewTokenModel } from './AuthModels/ViewAuthModels';
import { HTTP_STATUS_CODE } from '../../helpers/enums/http-status';
import {
  ConfirmationCodeAuthModel,
  EmailResendingAuthModel,
  RegistrationAuthModels,
} from './AuthModels/RegistrationAuthModels';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUserId } from './decorators/current-user-id.param.decorator';
import { ObjectId } from 'mongodb';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { ValidateConfirmationCodeGuard } from './guards/validation.guards/validate-confirmation-code.guard';
import { ValidateEmailResendingGuard } from './guards/validation.guards/validate-email-resending.guard';
import {
  NewPasswordAuthModel,
  PasswordRecoveryAuthModel,
} from './AuthModels/PasswordFlowAuthModels';
import { ValidateEmailRegistrationGuard } from './guards/validation.guards/validate-email-registration.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { DevicesService } from '../devices/devices-service';
import { TitleOfDevice } from './decorators/title-of-device.param.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { RefreshToken } from './decorators/refresh-token-param.decorator';
import { JwtService } from '../jwt/jwt-service';

@Controller('/hometask-nest/auth')
export class AuthController {
  constructor(
    protected jwtService: JwtService,
    protected devicesService: DevicesService,
    protected authService: AuthService,
  ) {}

  @SkipThrottle()
  @UseGuards(JwtAccessGuard)
  @Get('me')
  async getUserInformation(
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewAuthModel>,
  ) {
    const result = await this.authService.getUserInformation(userId);

    if (result) {
      res.status(HTTP_STATUS_CODE.OK_200).send(result);
    } else {
      res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<ViewTokenModel>,
    @Ip() ip: string,
    @TitleOfDevice() title: string,
  ) {
    const result = await this.authService.loginUser(userId);

    if (result) {
      await this.devicesService.createNewDevice(
        ip || 'unknown',
        title,
        result.userId,
        result.refreshToken,
      );

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

  @UseGuards(ValidateEmailRegistrationGuard)
  @Post('registration')
  async registerUser(
    @Body() inputRegisterModel: RegistrationAuthModels,
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

  @UseGuards(ValidateConfirmationCodeGuard)
  @Post('registration-confirmation')
  async confirmEmail(
    @Body() inputConfirmationCode: ConfirmationCodeAuthModel,
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<string>,
  ) {
    await this.authService.confirmEmail(inputConfirmationCode.code);
    res
      .status(HTTP_STATUS_CODE.NO_CONTENT_204)
      .send('Email was verified. Account was activated');
  }

  @UseGuards(ValidateEmailResendingGuard)
  @Post('registration-email-resending')
  async resendEmailConfirmation(
    @Body() inputEmail: EmailResendingAuthModel,
    @CurrentUserId() userId: ObjectId,
    @Res() res: Response<string>,
  ) {
    await this.authService.resendConfirmationEmailMessage(
      userId,
      inputEmail.email,
    );
    res
      .status(HTTP_STATUS_CODE.NO_CONTENT_204)
      .send(
        'Input data is accepted. Email with confirmation code will be send to passed email address.',
      );
  }
  @SkipThrottle()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async newRefreshToken(
    @CurrentUserId() userId: ObjectId,
    @RefreshToken() refreshToken: string,
    @Res() res: Response<ViewTokenModel | string>,
  ) {
    const tokens = await this.jwtService.changeTokensByRefreshToken(
      userId,
      refreshToken,
    );

    res.cookie(`refreshToken`, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res
      .status(HTTP_STATUS_CODE.OK_200)
      .send({ accessToken: tokens.accessToken });
  }

  @SkipThrottle()
  @UseGuards(JwtRefreshGuard)
  @Post('logout')
  async logoutUser(
    @RefreshToken() refreshToken: string,
    @Res() res: Response<void>,
  ) {
    await this.devicesService.deleteDeviceByRefreshToken(refreshToken);
    res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);
  }

  @Post('password-recovery')
  async passwordRecovery(
    @Body() inputEmail: PasswordRecoveryAuthModel,
    @Res() res: Response<string>,
  ) {
    await this.authService.sendEmailPasswordRecovery(inputEmail.email);
    res
      .status(HTTP_STATUS_CODE.NO_CONTENT_204)
      .send(
        'Email with instruction will be send to passed email address (if a user with such email exists)',
      );
  }

  @Post('new-password')
  async saveNewPassword(
    @Body() inputInfo: NewPasswordAuthModel,
    @Res() res: Response<string>,
  ) {
    await this.authService.saveNewPassword(
      inputInfo.newPassword,
      inputInfo.recoveryCode,
    );

    res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('New password is saved');
  }
}
