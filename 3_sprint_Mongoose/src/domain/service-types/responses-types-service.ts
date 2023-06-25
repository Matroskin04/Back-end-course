export type ErrorsTypeService = {
    errorsMessages: Array<{
        message: 'RecoveryCode is incorrect or expired',
        field: "recoveryCode" }>
}

export type ResponseTypeService = {
    status: number
    message: string
}