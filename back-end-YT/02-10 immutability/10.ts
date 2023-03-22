type User = {
    name: string
    hair: number
    address: {title: string}
    laptop: {title: string}
}

const user: User = {
    name: 'Dimych',
    hair: 32,
    address: {
        title: 'Minds'
    },
    laptop: {
        title: 'Asus'
    }
}

const movedUser = (user: User, city: string): User => {
    return {
        ...user,
        address: {...user.address, title: city}
    };
}

movedUser(user, 'Chita')