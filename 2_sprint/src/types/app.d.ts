import {ObjectId} from "mongodb";

declare global { // todo почему string без global, a objId с global работает
    namespace Express {
        export interface Request {
            userId: ObjectId | null
        }
    }
}
