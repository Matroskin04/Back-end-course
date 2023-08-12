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

function foo() {
  console.log(this);
  function bar() {
    console.log(this);
  }
  bar();
}
foo();
