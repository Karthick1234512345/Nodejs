const bcrypt = require('bcrypt');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const appConstants = require('../config/constants');
const logger = require('../services/logger');

const resetPassword = async (req) => {
  const {
    email, tempPassword, newPassword, confirmPassword,
  } = req;

  if (!email || !tempPassword || !newPassword || !confirmPassword) {
    throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
  }

  const user = await model.users.findOne({ where: { Email: email } });
  if (!user) {
    throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
  }

  try {
    const tempPwdIsValid = await bcrypt.compare(tempPassword, user.temproaryPassword);
    if (!tempPwdIsValid) {
      throw new ErrorHandler('ERR_INVALID_PASSWORD');
    }

    if (newPassword !== confirmPassword) {
      throw new ErrorHandler('ERR_PASSWORD_MISMATCH');
    }

    const hashedPwd = await bcrypt.hash(newPassword, appConstants.BCRYPT_SALT_ROUNDS);
    // eslint-disable-next-line max-len
    await model.users.update({ temproaryPassword: null, permanentPassword: hashedPwd }, { where: { id: user.id } });

    logger.info(`Password reset successfully for user ${email}`);
    return {
      success: true,
    };
  } catch (error) {
    logger.error(`An error occurred while resetting password for user ${email}: ${error}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};
module.exports = { resetPassword };
