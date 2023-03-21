const { ErrorHandler } = require('../util/errorHandler/error');
const model = require('../models');
const logger = require('../services/logger');

const createUser = async (userData) => {
  try {
    const existingUser = await model.users.findOne({ where: { Email: userData.email } });
    if (existingUser) {
      throw new ErrorHandler('ERR_USER_EXISTS');
    }
    const newUser = await model.users.create({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      Email: userData.email,
      Phonenumber: userData.Phonenumber,
      accountType: userData.accountType,
      status: userData.status,
    });
    logger.info(`New user created with email: ${userData.email}`);
    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.Email,
      Phonenumber: newUser.Phonenumber,
      accountType: newUser.accountType,
      status: newUser.status,
    };
  } catch (error) {
    logger.error(`Error occurred while creating new user. Error: ${error.message}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { createUser };
