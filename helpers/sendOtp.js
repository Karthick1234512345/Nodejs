// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const commonFunctions = require('../util/app/app-common');
const appConstants = require('../config/constants');
const { sendEmail } = require('../services/emailService');
const logger = require('../services/logger');

const sendOTP = async (req) => {
  try {
    const { email } = req;
    if (!email) {
      throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
    }
    const user = await model.User.findOne({ where: { Email: email } });
    if (!user) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }

    const otpObj = await commonFunctions.getSaltedOTP();
    const otpExpiry = moment(new Date()).add(appConstants.OTP_EXPIRY_TIME ? appConstants.OTP_EXPIRY_TIME : 5, 'm').toDate();
    const otpAttempts = user.otpAttempts !== null ? user.otpAttempts : 0;
    const otpWrongAttempts = user.otpWrongAttempts !== null ? user.otpWrongAttempts : 0;

    if (user.otpAttempts >= appConstants.OTP_MAX_ATTEMPTS) {
      throw new ErrorHandler('ERR_MAX_OTP_ATTEMPTS_REACHED');
    }

    const updateObj = {
      otpHash: otpObj.hashedOTP,
      otpExpiry: otpExpiry.toISOString(),
      otpAttempts: otpAttempts + 1,
      otpWrongAttempts,
    };

    await model.User.update(updateObj, { where: { id: user.id } });

    const emailData = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.Email ? user.Email : '',
      otp: otpObj.otp,
    };

    await sendEmail(emailData, 'otp');
    logger.info(`OTP has been sent to the email address: ${emailData.email}`);
    return {
      success: true,
    };
  } catch (error) {
    logger.error(`Error occurred while sending OTP: ${error}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }

    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { sendOTP };
