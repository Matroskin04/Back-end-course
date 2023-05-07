import {Router, Response, Request} from "express";
import {RequestWithBody} from "../types/types";
import {
    RegistrationAuthModel,
    RegisterConfirmAuthModel, RegisterResendConfirmAuthModel
} from "../models/AuthModels/RegistrationAuthModel";
import {usersService} from "../domain/users-service";
import {
    validateAuthConfirmationCode,
    validateLoginDataAuth,
    validateRegistrationDataAuth,
    checkToken, validateAuthEmail
} from "../middlewares/auth-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares";
import {jwtService} from "../domain/jwt-service";
import {ViewAuthModel, ViewTokenModel} from "../models/AuthModels/ViewAuthModels";
import {usersQueryRepository} from "../queryRepository/users-query-repository";
import {authService} from "../domain/auth-service";
import {LoginAuthInputModel} from "../models/AuthModels/LoginAuthModels";
import {ViewAllErrorsModels} from "../models/ViewAllErrorsModels";

export const authRoutes = Router();

authRoutes.get('/me', checkToken, async (req: Request,
                                               res: Response<ViewAuthModel>) => {

    const user = await usersQueryRepository.getUserByUserId(req.userId!);
    if (user) {
        res.status(204).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        })
    } else {
        res.sendStatus(404)
    }
})
authRoutes.post('/login', validateLoginDataAuth, getErrors, async (req: RequestWithBody<LoginAuthInputModel>,
                                                                   res: Response<ViewTokenModel>) => {

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user) {
        const token = jwtService.createJWT(user);
        res.status(204).send({accessToken: token});

    } else {
        res.sendStatus(401);
    }
})
authRoutes.post('/registration', validateRegistrationDataAuth, getErrors,
    async (req: RequestWithBody<RegistrationAuthModel>, res: Response<ViewAllErrorsModels | string>) => {

        const result = await authService.registerUser(req.body.email, req.body.login, req.body.password);
        result === true ? res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
            : res.status(400).send({
                errorsMessages: [
                    {
                        message: `This ${result} is already exists, point out another`,
                        field: result
                    }
                ]
            })
    })
authRoutes.post('/registration-confirmation', validateAuthConfirmationCode, getErrors,
    async (req: RequestWithBody<RegisterConfirmAuthModel>, res: Response<ViewAllErrorsModels | string>) => { //todo типизировать респонс

        const result = await authService.confirmEmail(req.body.code);
        result === true ? res.status(204).send('Email was verified. Account was activated')
            : res.status(400).send({
                errorsMessages: [
                    {
                        message: result,
                        field: 'code'
                    }
                ]
            })
    })
authRoutes.post('/registration-email-resending', validateAuthEmail, getErrors,
    async (req: RequestWithBody<RegisterResendConfirmAuthModel>, res: Response) => {

        const result = await authService.resendConfirmationEmailMessage(req.body.email);
        result === true ? res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address.')
            : res.status(400).send({
                errorsMessages: [
                    {
                        message: result,
                        field: 'email'
                    }
                ]
            })
    })