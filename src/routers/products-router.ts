import { Request, Response, Router } from 'express';
import { productsRepository } from '../repositories/products-repository';

export const productsRouter = Router({})

productsRouter.get('/', async ( req: Request, res: Response) => {
    const products = await productsRepository.getProducts()
    res.send(products)
})

productsRouter.post('/', async (req: Request, res: Response) => {
    const newProduct = await productsRepository.createProduct(req.body.title)
    if (newProduct) {
        res.status(201).send(newProduct)
    } else {
        res.sendStatus(404)
    }
})