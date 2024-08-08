import express, { Request, Response } from "express";
import CreateProductUseCase from "../../../usecase/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import UpdateProductUseCase from "../../../usecase/product/update/update.product.usecase";
import FindProductUseCase from "../../../usecase/product/find/find.product.usecase";
import ListProductUseCase from "../../../usecase/product/list/list.product.usecase";
import DeleteProductUseCase from "../../../usecase/product/delete/delete.product.usecase";

export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const usecase = new CreateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
        };
        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.put("/:id", async (req: Request, res: Response) => {
    const usecase = new UpdateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            id: req.params.id,
            name: req.body.name,
            price: req.body.price,
        };
        const output = await usecase.execute(productDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get("/:id", async (req: Request, res: Response) => {
    const usecase = new FindProductUseCase(new ProductRepository());
    try {
        const output = await usecase.execute({ id: req.params.id });
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.get("/", async (req: Request, res: Response) => {
    const usecase = new ListProductUseCase(new ProductRepository());
    try {
        const output = await usecase.execute({});
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productRoute.delete("/:id", async (req: Request, res: Response) => {
    const usecase = new DeleteProductUseCase(new ProductRepository());
    try {
        const output = await usecase.execute({ id: req.params.id });
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});