const { ErrorHandler } = require('../util/errorHandler/error');
const model = require('../models');
const logger = require('../services/logger');

const editUser = async (userId, userData) => {
  try {
    const existingUser = await model.users.findOne({ where: { id: userId } });

    if (!existingUser) {
      throw new ErrorHandler('ERR_USER_NOT_FOUND');
    }

    await model.users.update({
      firstName: userData.firstName,
      lastName: userData.lastName,
      Email: userData.Email,
      phoneNumber: userData.phoneNumber,
      accountType: userData.accountType,
      status: userData.status,
    }, { where: { id: userId } });
    logger.info(`User with id ${userId} updated`);
    return { success: true };
  } catch (error) {
    logger.error(`Error occurred while updating user with id ${userId}. Error: ${error.message}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { editUser };
