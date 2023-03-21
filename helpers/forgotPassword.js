// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
const moment = require('moment');
const bcrypt = require('bcrypt');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const commonFunctions = require('../util/app/app-common');
const appConstants = require('../config/constants');
const { sendEmail } = require('../services/emailService');
const logger = require('../services/logger');

const forgotPassword = async (req) => {
  const { email } = req;
  try {
    if (!email) {
      throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
    }

    const user = await model.users.findOne({ where: { Email: email } });

    if (!user) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }

    const tempPassword = commonFunctions.generateRandomPassword();
    const hashedPwd = await bcrypt.hash(tempPassword, appConstants.BCRYPT_SALT_ROUNDS);

    const expiryTime = new Date().setHours(new Date().getHours() + 24);

    const updateObj = {
      temproaryPassword: hashedPwd,
      temproaryPasswordExpiry: expiryTime,
      permanentPassword: null,
    };

    await model.users.update(updateObj, { where: { id: user.id } });

    const emailData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.Email ? user.Email : '',
      temproaryPassword: tempPassword,
    };

    await sendEmail(emailData, 'forgotPassword');

    logger.info(`Forgot password email sent to ${email}`);

    return {
      success: true,
    };
  } catch (error) {
    logger.error(`Error regarding sending forgot password email to ${email} - ${error}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { forgotPassword };
