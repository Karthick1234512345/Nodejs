const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../util/errorHandler/error');
const model = require('../models');
const logger = require('../services/logger');
const commonFunctions = require('../util/app/app-common');
const appConstants = require('../config/constants');
const { sendEmail } = require('../services/emailService');

const editUsertesing = async (userId, userData) => {
  try {
    const existingUser = await model.users.findOne({ where: { id: userId } });
    if (!existingUser) {
      throw new ErrorHandler('ERR_USER_NOT_FOUND');
    }

    const emailExists = await model.users.findOne({ where: { Email: userData.Email } });
    if (emailExists && emailExists.id !== userId) {
      throw new ErrorHandler('ERR_EMAIL_EXISTS');
    }

    let tempPassword;
    if (!emailExists && userData.Email) {
      tempPassword = commonFunctions.generateRandomPassword();
      const hashedPwd = await bcrypt.hash(tempPassword, appConstants.BCRYPT_SALT_ROUNDS);

      const expiryTime = new Date().setHours(new Date().getHours() + 24);

      const updateObj = {
        temproaryPassword: hashedPwd,
        temproaryPasswordExpiry: expiryTime,
        permanentPassword: null,
      };

      await model.users.update(updateObj, { where: { id: userId } });

      const emailData = {
        name: `${existingUser.firstName} ${existingUser.lastName}`,
        email: userData.Email,
        temproaryPassword: tempPassword,
      };
      await sendEmail(emailData, 'forgotPassword');
      logger.info(`Forgot password email sent to ${userData.Email}`);
    }

    await model.users.update({
      firstName: userData.firstName,
      lastName: userData.lastName,
      Email: userData.Email,
      Phonenumber: userData.Phonenumber,
      accountType: userData.accountType,
      status: userData.status,
    }, { where: { id: userId } });

    logger.info(`User with id ${userId} updated`);
    return { success: true, tempPassword };
  } catch (error) {
    logger.error(`Error occurred while updating user with id ${userId}. Error: ${error.message}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};
module.exports = { editUsertesing };
