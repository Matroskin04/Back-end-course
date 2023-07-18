import {Router} from "express";
import {
    validateAuthConfirmationCode,
    validateLoginDataAuth,
    validateRegistrationDataAuth,
    validateAuthEmail, validateAuthEmailForPassRecovery, validateAuthNewPassword
} from "../middlewares/validation-middlewares/auth-validation-middlewares";
import {getErrors} from "../middlewares/validation-middlewares/catch-errors-middlewares";
import {
    validateAccessToken,
    validateRefreshToken
} from "../middlewares/validation-middlewares/jwt-validation-middlewares";
import {validateInfoRequest} from "../middlewares/info-request-middlewares/validate-info-request-middleware";
import {saveInfoRequest} from "../middlewares/info-request-middlewares/save-info-request-middleware";
import {container} from "../composition-root";
import {AuthController} from "../controllers/auth-controller";

export const authRoutes = Router();
const authController = container.resolve(AuthController);

authRoutes.get('/me',
    validateAccessToken,
    authController.getUserInformation.bind(authController));

authRoutes.post('/login',
    saveInfoRequest,
    validateInfoRequest,
    validateLoginDataAuth,
    getErrors,
    authController.loginUser.bind(authController));

authRoutes.post('/registration',
    saveInfoRequest,
    validateInfoRequest,
    validateRegistrationDataAuth,
    getErrors,
    authController.registerUser.bind(authController));

authRoutes.post('/registration-confirmation',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthConfirmationCode,
    getErrors,
    authController.confirmEmail.bind(authController));

authRoutes.post('/registration-email-resending',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthEmail,
    getErrors,
    authController.resendEmailConfirmation.bind(authController));

authRoutes.post('/refresh-token',
    validateRefreshToken,
    authController.newRefreshToken.bind(authController))

authRoutes.post('/logout',
    validateRefreshToken,
    authController.logoutUser.bind(authController));

authRoutes.post('/password-recovery',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthEmailForPassRecovery,
    getErrors,
    authController.passwordRecovery.bind(authController));

authRoutes.post('/new-password',
    saveInfoRequest,
    validateInfoRequest,
    validateAuthNewPassword,
    getErrors,
    authController.saveNewPassword.bind(authController))