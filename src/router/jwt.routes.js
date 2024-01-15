import { generateToken, authToken, isValidPassword, createHash, isProductOwner  } from "../utils.js";
import { Router } from "express";
import usersDao from "../DAO/classes/users.dao.js";
import logger from "../controllers/logger.js"
import ProductsDao from "../DAO/classes/products.dao.js";
import userDTO from "../DAO/DTO/usersDTO.js";

const jwtEstrategy = Router();

const usersDaoInstance = new usersDao();
const productsDaoInstance = new ProductsDao();



// Endpoint para el registro de usuarios
jwtEstrategy.post("/formRegister", async (req, res) => {
    const { first_name, last_name, email, age, rol, password } = req.body;
    // Validación si existe el usuario
    const exist = await usersDaoInstance.findEmail({ email });
    if (exist) {
        return res.status(400).send({ error: "El usuario ya existe" });
    }

    // Crear un objeto usuario
    const user = {

    first_name, 
    last_name, 
    email, 
    age, 
    rol, 
    password
    };


    const result = await usersDaoInstance.addUser(user);
    if (result === 'Error al crear el usuario') {
        return res.status(500).send({ status: 'error', error: result });
    }
    const access_token = generateToken(user);
    res.send({ status: "success", token: access_token });
});

jwtEstrategy.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validar si el email y la contraseña corresponden a un usuario
    const user = await usersDaoInstance.findEmail({ email });
    logger.debug(' jwt', user);
    logger.debug('Contraseña proporcionada:', password);
    // Si no existe el usuario, retornar un error
    if (!user || !isValidPassword(user, password)) {
        logger.debug("Contraseña válida:", isValidPassword(user, password));
        return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
    }
    // Crear un token y enviar la respuesta
    const access_token = generateToken(user);
    console.log('Token generado en /login:', access_token);

    logger.info("Token generado:", access_token);
    res.send({ status: "success", token: access_token });
});

jwtEstrategy.get("/current", authToken, async (req, res) => {
    try {
        const userDTO = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            rol: req.user.rol,
            password: req.user.password,
        };
        const access_token = generateToken(req.user);
        res.send({ status: "success", user: userDTO, token: access_token });
    } catch (error) {
        logger.error("Error al obtener el usuario actual:", error);
        res.status(500).send({ status: "error", error: "Error al obtener el usuario actual" });
    }
});

jwtEstrategy.post("/createProduct", authToken, async (req, res) => {
    try {
        const { title, description } = req.body;
        const owner = req.user.rol === 'premium' ? req.user._id : null;

        const newProduct = await product.createProduct({ title, description, owner });

        res.status(201).send({ status: "success", product: newProduct });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al crear el producto" });
    }
});

jwtEstrategy.put("/:productId", authToken, isProductOwner, async (req, res) => {
    const userId = req.user._id; // Obtén el ID del usuario desde la sesión

    try {
        const result = await productsDaoInstance.updateProduct(userId, req.params.productId, req.body);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al actualizar producto:", error);
        res.status(500).json({ status: "error", error: "Error al actualizar producto" });
    }
});

jwtEstrategy.delete("/:productId", authToken, isProductOwner, async (req, res) => {
    const userId = req.user._id; // Obtén el ID del usuario desde la sesión

    try {
        const result = await productsDaoInstance.deleteProduct(userId, req.params.productId);
        res.status(200).json({ status: "success", result: result });
    } catch (error) {
        console.error("Error al eliminar producto:", error);
        res.status(500).json({ status: "error", error: "No se puede eliminar producto" });
    }
});


export default jwtEstrategy;



/*
LA QUE USABA ANTES: 
jwtEstrategy.get("/current", authToken, async (req, res) => {
    try {
        res.send({ status: "success", payload: req.user });
    } catch (error) {
        logger.error("Error al obtener el usuario actual:", error);
        res.status(500).send({ status: "error", error: "Error al obtener el usuario actual" });
    }
});*/