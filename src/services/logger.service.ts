const winston = require('winston');
// logger configs
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: {service: 'amp-engine'},
  transports: [
    //new winston.transports.Console(),
    // new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'mailer.log', level: 'info'}),
  ],
});

Object.freeze(logger);
export default logger;

