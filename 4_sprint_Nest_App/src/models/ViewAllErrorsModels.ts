
export type ViewAllErrorsModels = {
    errorsMessages: ErrorsMessagesType
}

type ErrorsMessagesType = Array<{
    "message": string
    "field": string
}>