import { Router } from "express";
import passport from "passport";
import ProductModel from "../DAO/models/products.js";
import ProductsDao from "../DAO/classes/products.dao.js";
import { authToken, isProductOwner } from "../utils.js"

const productsDaoInstance = new ProductsDao();
const productRouter = Router();

// Middleware de autenticación con Passport JWT
productRouter.use(passport.authenticate('jwt', { session: false }));

// Rutas protegidas
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

productRouter.get("/", async (req, res) => {
  try {
    const products = await productsDaoInstance.getProducts();
    res.render("products", { products }); // Pasa la lista de productos a la vista
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

productRouter.post("/", async (req, res) => {
  const userId = req.user._id; // Obtén el ID del usuario desde la sesión

  try {
    const result = await productsDaoInstance.addProduct(userId, req.body);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ status: "error", error: "No se puede agregar producto" });
  }
});

productRouter.put("/:id", authToken, isProductOwner, async (req, res) => { 
  const userId = req.user._id; // Obtén el ID del usuario desde la sesión

  try {
    const result = await productsDaoInstance.updateProduct(userId, req.params.id, req.body);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ status: "error", error: "Error al actualizar producto" });
  }
});

productRouter.delete("/:id", authToken, isProductOwner, async (req, res) => {
  const userId = req.user._id; // Obtén el ID del usuario desde la sesión

  try {
    const result = await productsDaoInstance.deleteProduct(userId, req.params.id);
    res.status(200).json({ status: "success", result: result });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ status: "error", error: "No se puede eliminar producto" });
  }
});

// Detalles del producto
productRouter.get("/details/:id", async (req, res) => {
  try {
    const products = await ProductModel.findById(req.params.id);
    if (product) {
      res.render("details", { products });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

export default productRouter;




// import { Router } from "express";
// import ProductModel from "../DAO/models/products.js";


// const productRouter = Router();



// productRouter.get("/:id", async (req, res) => {
//   try {
//     const product = await ProductModel.findById(req.params.id);
//     if (product) {
//       res.json(product);
//     } else {
//       res.status(404).json({ error: "Producto no encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener el producto" });
//   }
// });

// productRouter.get("/", async (req, res) => {
//   try {
//     const products = await ProductModel.find();
//     res.render("products", { products }); // Pasa la lista de productos a la vista
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener los productos" });
//   }
// });

// productRouter.post("/", async (req, res) => {
//   const { product, description, price } = req.body;
//   try {
//     const newProduct = new ProductModel({
//       product,
//       description,
//       price
//     });
//     await newProduct.save();
//     res.json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: "Error al crear un nuevo producto" });
//   }
// });

// productRouter.put("/:id", async (req, res) => {
//   const { product, description, price } = req.body;
//   try {
//     const updatedProduct = await ProductModel.findByIdAndUpdate(
//       req.params.id,
//       {
//         product,
//         description,
//         price
//       },
//       { new: true }
//     );

//     if (updatedProduct) {
//       res.json(updatedProduct);
//     } else {
//       res.status(404).json({ error: "Producto no encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error al actualizar el producto" });
//   }
// });

// productRouter.delete("/:id", async (req, res) => {
//   try {
//     const deletedProduct = await ProductModel.findByIdAndRemove(req.params.id);
//     if (deletedProduct) {
//       res.json(deletedProduct);
//     } else {
//       res.status(404).json({ error: "Producto no encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error al eliminar el producto" });
//   }
// });

// //details
// productRouter.get("/details/:id", async (req, res) => {
//   try {
//     const products = await ProductModel.findById(req.params.id);
//     if (product) {
//       res.render("details", { products });
//     } else {
//       res.status(404).json({ error: "Producto no encontrado" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error al obtener el producto" });
//   }
// });


// export default productRouter;