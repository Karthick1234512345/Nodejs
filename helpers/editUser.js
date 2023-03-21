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
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      Email: userData.email,
      PhoneNumber: userData.PhoneNumber,
      accountType: userData.accountType,
      status: userData.status,
    }, { where: { id: userId } });
    logger.info(`User with id ${userId} updated`);
    const updatedUser = await model.users.findOne({ where: { id: userId } });
    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.Email,
      PhoneNumber: updatedUser.PhoneNumber,
      accountType: updatedUser.accountType,
      status: updatedUser.status,
    };
  } catch (error) {
    logger.error(`Error occurred while updating user with id ${userId}. Error: ${error.message}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { editUser };
