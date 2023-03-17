const bcrypt = require('bcrypt');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');
const appConstants = require('../config/constants');
const logger = require('../services/logger');
const { generateToken } = require('../util/jwtAuth/token');

const verifyOTP = async (req) => {
  try {
    const { email, otp } = req;
    if (!email || !otp) {
      throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
    }
    const user = await model.User.findOne({ where: { Email: email } });
    if (!user) {
      throw new ErrorHandler('ERR_RCRD_NOT_AVLBLE');
    }
    const { otpHash } = user;
    const isMatch = await bcrypt.compare(otp, otpHash);
    if (!isMatch) {
      const otpWrongAttempts = user.otpWrongAttempts !== null ? user.otpWrongAttempts : 0;
      const updateObj = {
        otpWrongAttempts: otpWrongAttempts + 1,
      };
      await model.User.update(updateObj, { where: { id: user.id } });
      if (otpWrongAttempts + 1 >= appConstants.OTP_WRONG_MAX_ATTEMPTS) {
        throw new ErrorHandler('ERR_MAX_WRONG_OTP_ATTEMPTS_REACHED');
      }
      throw new ErrorHandler('ERR_INVALID_OTP');
    }

    const otpExpiry = new Date(user.otpExpiry);
    const currentTime = new Date();
    if (otpExpiry < currentTime) {
      throw new ErrorHandler('ERR_OTP_EXPIRED');
    }
    await model.User.update({ otpWrongAttempts: 0 }, { where: { id: user.id } });
    logger.info('OTP verification successful');
    const { token, refreshToken } = await generateToken(user);

    return {
      success: true,
      token,
      refreshToken,
    };
  } catch (error) {
    logger.error(`Error while generating the token: ${error}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }

    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { verifyOTP };
