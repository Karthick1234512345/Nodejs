const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const logger = require('../services/logger');

const getUsers = async (req) => {
  try {
    const {
      firstName, lastName, email, accountType, status,
    } = req;

    const whereClause = {};
    if (firstName) whereClause.firstName = firstName;
    if (lastName) whereClause.lastName = lastName;
    if (email) whereClause.Email = email;
    if (accountType) whereClause.accountType = accountType;
    if (status) whereClause.status = status;

    const users = await model.User.findAll({ where: whereClause });
    if (!users.length) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }
    logger.info(`${users.length} users found`);
    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.Email,
      accountType: user.accountType,
      status: user.status,
    }));
  } catch (error) {
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    logger.error(`Error occurred while getting users: ${error.message}`);
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { getUsers };
