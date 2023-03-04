import { productCollection, ProductType } from './db';

export const productsRepository = {
    async getProducts(): Promise<ProductType[]> {
        return productCollection.find({}).toArray()
    },
    async createProduct(title: string): Promise<ProductType | null> {
        if (!title.trim()) {
            return null
        }
        const result = await productCollection.insertOne({title})
        return {
            title: title,
            _id: result.insertedId
        }
    }
}