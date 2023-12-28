import EErrors from "../../services/errors/enums.js";
import logger from "../../controllers/logger.js"

export default (error, req, res, next) =>{
    logger.error(error.cause);
    switch (error.cause){
        case EErrors.INVALID_TYPES_ERROR:
            res.send({status:"error", error: error.name})
            break;
            default:
                res.send({status:"error", error:"error no manejado"})
    }
}