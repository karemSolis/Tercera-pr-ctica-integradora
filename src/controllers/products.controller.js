import ProductsDao from "../DAO/classes/products.dao.js";
import productModel from "../DAO/models/products.js";
import { isUserAdmin } from "../DAO/classes/products.dao.js";

const productsDaoInstance = new ProductsDao();

export const getProducts = async (req, res) => {
    try {
        const result = await productsDaoInstance.getProducts();
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ status: "error", error: "No se puede obtener productos" });
    }
};
export const addProduct = async (req, res) => {
    const userId = req.user._id; // Obtén el ID del usuario desde la sesión

    try {
        const result = await productsDaoInstance.addProduct(userId, req.body);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({ status: "error", error: "No se puede agregar producto" });
    }
};

export const getProductById = async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await productsDaoInstance.getProductById(productId);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al obtener producto por ID:", error);
        res.status(500).json({ status: "error", error: "No se puede obtener producto por ID" });
    }
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const updatedProduct = req.body;

    try {
        // Obtén el ID del usuario desde la sesión
        const userId = req.user._id;

        // Verifica si el usuario es administrador
        const userIsAdmin = isUserAdmin(userId);

        // Busca el producto existente por su ID
        const existingProduct = await productModel.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ status: "error", error: "No se encuentra producto" });
        }

        // Verifica los permisos del usuario
        if (
            userId.toString() !== existingProduct.owner.toString() &&
            !userIsAdmin
        ) {
            return res.status(403).json({ status: "error", error: "No tienes permisos para actualizar este producto" });
        }

        // Realiza la actualización del producto
        const updatedProductResult = await productModel.findByIdAndUpdate(
            productId,
            updatedProduct,
            { new: true }
        );

        if (!updatedProductResult) {
            return res.status(404).json({ status: "error", error: "No se encuentra producto" });
        }

        return res.status(200).json({ status: "success", result: "Producto actualizado" });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        return res.status(500).json({ status: "error", error: "Error al actualizar producto" });
    }

};

export const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await productsDaoInstance.deleteProduct(productId);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ status: "error", error: "No se puede eliminar producto" });
    }
};

export const exist = async (req, res) => {
    const { productId } = req.params;

    try {
        const result = await productsDaoInstance.exist(productId);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al verificar la existencia del producto:", error);
        res.status(500).json({ status: "error", error: "Error al verificar la existencia del producto" });
    }
};
