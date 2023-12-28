import winston from "winston";

winston.addColors({
    fatal: 'red',
  });
  
const devLogger = winston.createLogger({
    levels: winston.config.npm.levels,
    level: "debug",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ],
    
})

const prodLogger = winston.createLogger({
    levels: winston.config.npm.levels,
    level: "info",
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.File({ filename: 'logfileprod.log', level: 'info' }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ],

})


const logger = (process.env.ENV === "Production" ? prodLogger : devLogger)
logger.warning = (message) => logger.log('warning', message);
logger.fatal = (message) => logger.log('fatal', message);


export default logger 