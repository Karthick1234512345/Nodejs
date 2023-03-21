const Joi = require('@hapi/joi');
const { validators, configs } = require('./index');
const logger = require('../../services/logger');
const { ErrorHandler } = require('../../util/errorHandler/error');

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

const getValidationConfigName = (URL) => {
  let configName = '';
  const requestURL = URL.replace(/-/g, '/').split('/');
  requestURL.shift();
  requestURL.forEach((element) => {
    configName += toTitleCase(element);
  });
  return configName;
};

const validatePayload = (req, res, next) => {
  const configMethodName = `get${getValidationConfigName(req.url)}${req.method}Schema`;
  logger.info(`Getting ${configMethodName} from validators`);
  if (!validators[configMethodName]) {
    logger.info(`Unable to pickUp schema configurations ${req.url}`);
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
  const schema = Joi.object().keys(validators[configMethodName]());

  if (!Joi.isSchema(schema)) {
    logger.info(`Unable to validate schema for request ${req.url}`);
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
  const { error } = schema.validate(req.body, configs.joiConfigs);
  if (!error) {
    return next();
  }
  throw new ErrorHandler('ERR_INVLD_PAYLOAD', undefined, error.details);
};

module.exports = {
  validatePayload,
};
