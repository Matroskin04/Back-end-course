export type DeviceType = { //todo _id join with deviceId
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
    userId: string
    expirationDate: number
}

export type DeviceOutputType = {
    ip: string
    title: string
    lastActiveDate: string
    deviceId: string
}

