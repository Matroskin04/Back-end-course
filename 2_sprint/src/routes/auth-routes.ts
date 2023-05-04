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

export const authRoutes = Router();

authRoutes.get('/login/me', checkToken, async (req: Request,
                                               res: Response<ViewAuthModel>) => {

    const user = await usersQueryRepository.getUserByUserId(req.userId!);
    if (user) {
        res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user._id.toString()
        })
    }
    res.sendStatus(404)
})
authRoutes.post('/login', validateLoginDataAuth, getErrors, async (req: RequestWithBody<LoginAuthInputModel>,
                                                                   res: Response<ViewTokenModel>) => {

    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password);

    if (user) {
        const token = jwtService.createJWT(user);
        res.status(200).send({accessToken: token});

    } else {
        res.sendStatus(401);
    }
})
authRoutes.post('/registration', validateRegistrationDataAuth, getErrors,
    async (req: RequestWithBody<RegistrationAuthModel>, res: Response) => {

        const result = await authService.registerUser(req.body.email, req.body.login, req.body.password);
        result ? res.status(204).send('Input data is accepted. Email with confirmation code will be send to passed email address')
            : res.sendStatus(400)
    })
authRoutes.post('/registration-confirmation', validateAuthConfirmationCode, getErrors,
    async (req: RequestWithBody<RegisterConfirmAuthModel>, res: Response) => {

        const result = await authService.confirmEmail(req.body.code);
        result ? res.sendStatus(204)
            : res.sendStatus(400)
    })
authRoutes.post('/registration-email-resending', validateAuthEmail, getErrors,
    async (req: RequestWithBody<RegisterResendConfirmAuthModel>, res: Response) => {

        const result = await authService.resendConfirmationEmailMessage(req.body.email);
        result ? res.sendStatus(204)
            : res.sendStatus(400)
    })