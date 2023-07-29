// import {ObjectId} from "mongodb";
//
// class Device {
//     cost: number
//     constructor(public id: ObjectId = new ObjectId(), public title: string = 'Phone', cost: number = 100) {
//         this.cost = cost
//     }
//     getCost() {
//         console.log(this.cost)
//     }
//     increaseCost(count: number) {
//         console.log(this.cost + count)
//     }
// }
//
//

import { UserModel } from './domain/users-schema-model';

console.log(1);
const user = {
  login: 'egor',
  email: `123`,
  passwordHash: `2004`,
};
const user1 = new UserModel(user);
console.log(user1);
