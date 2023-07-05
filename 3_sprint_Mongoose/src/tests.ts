import {ObjectId} from "mongodb";

class Device {
    cost: number
    constructor(public id: ObjectId = new ObjectId(), public title: string = 'Phone', cost: number = 100) {
        this.cost = cost
    }
    getCost() {
        console.log(this.cost)
    }
    increaseCost(count: number) {
        console.log(this.cost + count)
    }
}

// const device1 = new Device()

const user = {
    age: 1,
    get() {
        console.log(this.age)
    }
}

setTimeout(() => console.log(this), 1000)
