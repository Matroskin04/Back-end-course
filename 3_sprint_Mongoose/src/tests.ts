class Device {
    cost: number
    constructor(public id: string, public title: string) {
        this.cost = 1000
    }
}


const device1 = new Device('123', 'IPhone')
