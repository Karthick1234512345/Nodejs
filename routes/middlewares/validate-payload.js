// const Joi = require('@hapi/joi');
// const { validators, configs } = require('./index');
// const logger = require('../../services/logger');
// const { ErrorHandler } = require('../../util/errorHandler/error');

// function toTitleCase(str) {
//   return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
// }

// const getValidationConfigName = (URL) => {
//   let configName = '';
//   const requestURL = URL.replace(/-/g, '/').split('/');
//   requestURL.shift();
//   requestURL.forEach((element) => {
//     configName += toTitleCase(element);
//   });
//   return configName;
// };

// // eslint-disable-next-line consistent-return
// const validatePayload = (req, res, next) => {
//   try {
//     const configMethodName = `get${getValidationConfigName(req.url)}${req.method}Schema`;
//     logger.info(`Getting ${configMethodName} from validators`);
//     // console.log(validators[configMethodName], 'VALIDATORS');
//     if (!validators[configMethodName]) {
//       logger.info(`Unable to pickUp schema configurations ${req.url}`);
//       throw new ErrorHandler('ERR_INRNL_SRVR');
//     }
//     const schema = Joi.object().keys(validators[configMethodName]());
//     console.log(schema, '......................SHEMA');
//     console.log(Joi.isSchema(schema), '......................Joi.isSchema');
//     if (!Joi.isSchema(schema)) {
//       logger.info(`Unable to validate schema for request ${req.url}`);
//       throw new ErrorHandler('ERR_INRNL_SRVR');
//     }
//     const { error } = schema.validate(req.body, configs.joiConfigs);
//     console.log(error, '...............error');
//     if (!error) {
//     //   console.log('111111111111111111111111111');
//       return next();
//     }
//   } catch (error) {
//     console.log(error, 'ERROR');

//     throw new ErrorHandler('ERR_INVLD_PAYLOAD', undefined, error.details);
//   }
// };

// module.exports = {
//   validatePayload,
// };
// const Joi = require('@hapi/joi');
// const { validators, configs } = require('../../utils/validators');
// const logger = require('../../utils/app/logger');
// const { ErrorHandler } = require('../../utils/errorHandler/error');
// const { deleteObject } = require('../../services/s3');
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
