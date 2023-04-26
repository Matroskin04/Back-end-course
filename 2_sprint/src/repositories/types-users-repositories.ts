export type userType = {
    id?: string
    login: string
    email: string
    createdAt: string
}

export type bodyUserType = {
    login: string
    email: string
    password: string
}

export type userTypeWithoutPass = {
    login: string
    email: string
    createdAt: string
}


