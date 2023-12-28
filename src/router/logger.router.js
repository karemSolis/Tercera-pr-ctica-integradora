// logger.routes.js
import { Router } from "express";
import loggerMiddleware from "../middlewares Error/loggerMiddleware.js"
import logger from "../controllers/logger.js";

const loggerRoutes = Router();


loggerRoutes.get('/', loggerMiddleware, (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warning('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');

    res.send('Logs generados. Revisa tus archivos de registro.');
});

export default loggerRoutes;
