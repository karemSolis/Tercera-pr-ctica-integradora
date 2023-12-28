import logger from "../controllers/logger.js"


const loggerMiddleware = async (req, res, next) => {
    console.log("Middleware ejecutado");
    req.logger = logger;
    next();
}

export default loggerMiddleware
