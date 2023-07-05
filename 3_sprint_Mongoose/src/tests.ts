import {ObjectId} from "mongodb";

class Device {
    cost: number
    constructor(public id: ObjectId = new ObjectId(), public title: string = 'Phone', public s: string = '1') {
        this.cost = 1000
    }
}


const device1 = new Device()
console.log(device1)
