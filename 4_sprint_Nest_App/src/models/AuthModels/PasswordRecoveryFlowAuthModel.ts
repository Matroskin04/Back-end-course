export type PasswordRecoveryAuthModel = {email: string}
export type NewPasswordAuthModel = {
    newPassword: string
    recoveryCode: string
}
