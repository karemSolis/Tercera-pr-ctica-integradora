import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import {faker} from '@faker-js/faker'
import logger from './controllers/logger.js'



export const createHash = password =>{
    console.log('Ejecutando createHash');
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
} 

export const isValidPassword = (user, password) => {
  logger.info('Ejecutando isValidPassword');
  try {
      if (!user) {
          console.log("Usuario no encontrado al validar la contraseña");
          return false;
      }

      return bcrypt.compareSync(password, user.password);
  } catch (error) {
      logger.error("Error al comparar contraseñas:", error);
      return false;
  }
};

//const PRIVATE_KEY = "coderJsonWebToken"
export const PRIVATE_KEY = process.env.PRIVATE_KEY || "defaultFallbackValue";

export const generateToken = (user) => {
    console.log('Ejecutando generateToken');
    const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "24h" });
    console.log('Token generado:', token);
    return token;
};


export const authToken = (req, res, next) => {
  const autHeader = req.headers.authorization;
  const cookieToken = req.cookies.token;
  const urlToken = req.params.token;

  const token = autHeader ? autHeader.split(" ")[1] : cookieToken || urlToken;
  console.log('Token recibido:', token);

  if (!token) {
    return res.status(401).send({
      error: "No autenticado"
    });
  }

  jwt.verify(token, PRIVATE_KEY, (error, credential) => {
    
    if (error) {
      console.error('Error al verificar el token:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ error: "El token ha expirado" });
      }
      return res.status(403).send({ error: "No autorizado" });
    }
    req.user = credential.user;
    next();
  });
};



export const isProductOwner = async (req, res, next) => {
    try {
      // Verificar si hay un usuario autenticado
      if (!req.user) {
        return res.status(401).json({ status: 'error', error: 'Usuario no autenticado' });
      }
  
      const productId = req.params.id;
  
      // Obtener el producto por ID (suponiendo que tienes una función en tu DAO para esto)
      const product = await productsDaoInstance.getProductById(productId);
  
      // Verificar si el producto existe
      if (!product) {
        return res.status(404).json({ status: 'error', error: 'Producto no encontrado' });
      }
  
      // Verificar si el usuario es admin (rol admin) y permitirle
      if (req.user.rol === 'admin' || req.user.rol === 'premium') {
        return next();
      }
  
      // Verificar si el usuario es el propietario del producto
      if (product.owner === req.user.email) {
        return next();
      } else {
        return res.status(403).json({ status: 'error', error: 'No tienes permisos para realizar esta acción' });
      }
    } catch (error) {
      console.error('Error en isProductOwner middleware:', error);
      return res.status(500).json({ status: 'error', error: 'Error en el servidor' });
    }
  };
  

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//-----------------------------------------------------

export const generateUser = () => {

    let products = []

    for (let i = 0; i < 10; i++) {
        products.push(generateProduct())
    }
    logger.debug(products)

    return {
        name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        sex: faker.person.sex(),
        email: faker.internet.email(),
        job: faker.person.jobTitle()
    }
}

export const generateProduct = () => {
    return {
        title: faker.commerce.product(),
        description: faker.commerce.productDescription()
    }
}


export default __dirname
