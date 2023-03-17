const bcrypt = require('bcrypt');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const appConstants = require('../config/constants');
const logger = require('../services/logger');

const changePassword = async (req) => {
  try {
    const {
      email, currentPassword, newPassword, confirmPassword,
    } = req;

    if (!email || !currentPassword || !newPassword || !confirmPassword) {
      throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
    }

    const user = await model.User.findOne({ where: { Email: email } });
    if (!user) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }

    const currentPwdIsValid = await bcrypt.compare(currentPassword, user.permanentPassword);
    if (!currentPwdIsValid) {
      throw new ErrorHandler('ERR_INVALID_PASSWORD');
    }

    if (newPassword !== confirmPassword) {
      throw new ErrorHandler('ERR_PASSWORD_MISMATCH');
    }

    const hashedPwd = await bcrypt.hash(newPassword, appConstants.BCRYPT_SALT_ROUNDS);

    await model.User.update({ permanentPassword: hashedPwd }, { where: { id: user.id } });

    logger.info('Password changed successfully');
    return {
      success: true,
    };
  } catch (error) {
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    logger.error(`Error occurred while changing password: ${error.message}`);
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { changePassword };
