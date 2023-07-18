import {Request, Response} from "express";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {RequestWithBody} from "../types/requests-types";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {
    RegisterConfirmAuthModel,
    RegisterResendConfirmAuthModel,
    RegistrationAuthModel
} from "../models/AuthModels/RegistrationAuthModel";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";
import {NewPasswordAuthModel, PasswordRecoveryAuthModel} from "../models/AuthModels/PasswordRecoveryFlowAuthModel";
import {HTTP_STATUS_CODE} from "../helpers/enums/http-status";
import {DevicesService} from "../domain/devices-service";
import {AuthService} from "../domain/auth-service";
import {JwtService} from "../domain/jwt-service";
import { injectable } from "inversify";


@injectable()
export class AuthController {

    constructor(protected jwtService: JwtService,
                protected devicesService: DevicesService,
                protected authService: AuthService) {
    }

    async getUserInformation(req: Request, res: Response<ViewAuthModel>) {

        try {
            const result = await this.authService.getUserInformation(req.userId!);

            if (result) {
                res.status(HTTP_STATUS_CODE.OK_200).send(result);

            } else {
                res.sendStatus(HTTP_STATUS_CODE.NOT_FOUND_404);
            }

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async loginUser(req: RequestWithBody<LoginAuthInputModel>,
                    res: Response<ViewTokenModel>) {

        try {
            const result = await this.authService.loginUser(req.body.loginOrEmail, req.body.password);

            if (result) {
                await this.devicesService.createNewDevice(
                    req.socket.remoteAddress || 'unknown',
                    req.headers['user-agent'] || 'unknown',
                    result.userId, result.refreshToken);

                res.cookie('refreshToken', result.refreshToken, {httpOnly: true, secure: true,});
                res.status(HTTP_STATUS_CODE.OK_200).send({accessToken: result.accessToken});

            } else {
                res.sendStatus(HTTP_STATUS_CODE.UNAUTHORIZED_401);
            }

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async registerUser(req: RequestWithBody<RegistrationAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        try {
            await this.authService.registerUser(req.body.email, req.body.login, req.body.password);
            res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address')

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async confirmEmail(req: RequestWithBody<RegisterConfirmAuthModel>,
                       res: Response<ViewAllErrorsModels | string>) {

        try {
            await this.authService.confirmEmail(req.userId!);
            res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Email was verified. Account was activated')

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async resendEmailConfirmation(req: RequestWithBody<RegisterResendConfirmAuthModel>,
                                  res: Response<string>) {

        try {
            await this.authService.resendConfirmationEmailMessage(req.userId!, req.body.email);
            res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async newRefreshToken(req: Request, res: Response<string | ViewTokenModel>) {

        try {
            const tokens = await this.jwtService.changeTokensByRefreshToken(req.userId!, req.refreshToken);
            if (!tokens) {
                res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).send('Something was wrong');
                return;
            }

            res.cookie(`refreshToken`, tokens.refreshToken, {httpOnly: true, secure: true,})
            res.status(HTTP_STATUS_CODE.OK_200).send({accessToken: tokens.accessToken});

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async logoutUser(req: Request, res: Response<void>) {

        try {
            await this.devicesService.deleteDeviceByRefreshToken(req.refreshToken);
            res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT_204);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async passwordRecovery(req: RequestWithBody<PasswordRecoveryAuthModel>, res: Response<string>) {

        try {
            await this.authService.sendEmailPasswordRecovery(req.body.email);
            res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('Email with instruction will be send to passed email address (if a user with such email exists)');

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }

    async saveNewPassword(req: RequestWithBody<NewPasswordAuthModel>, res: Response<string | ViewAllErrorsModels>) {

        try {
            const result = await this.authService.saveNewPassword(req.body.newPassword, req.body.recoveryCode);

            result === true ? res.status(HTTP_STATUS_CODE.NO_CONTENT_204).send('New password is saved')
                : res.status(HTTP_STATUS_CODE.BAD_REQUEST_400).send(result);

        } catch (err) {
            console.log(`Something was wrong. Error: ${err}`);
        }
    }
}

