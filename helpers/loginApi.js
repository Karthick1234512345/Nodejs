const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../util/errorHandler/error');
const model = require('../models');
const { generateToken } = require('../util/jwtAuth/token');
const logger = require('../services/logger');

const postlogin = async (req) => {
  const { email, password } = req;
  if (!email || !password) {
    throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
  }

  const user = await model.users.findOne({ where: { Email: email } });
  if (!user) {
    throw new ErrorHandler('ERR_INVLD_CRDNTLS');
  }
  try {
    let userLoggedInWithTemporaryPassword = false;
    if (user.dataValues.temproaryPassword) {
      // eslint-disable-next-line max-len
      const isTemporaryPasswordValid = await bcrypt.compare(password, user.dataValues.temproaryPassword);

      if (!isTemporaryPasswordValid) {
        throw new ErrorHandler('ERR_INVALID_TEMP_PASSWORD');
      }
      if (user.dataValues.temproaryPasswordExpiry < new Date()) {
        throw new ErrorHandler('ERR_TMPR_PWD_EXPIRED');
      }
      userLoggedInWithTemporaryPassword = true;
    } else {
      const isPermanentPassword = await bcrypt.compare(password, user.dataValues.permanentPassword);
      if (!isPermanentPassword) {
        throw new ErrorHandler('ERR_INVALID_PRMT_PASSWORD');
      }
    }

    logger.info(`Generating tokens for user ${user.id}`);
    const { token, refreshToken } = await generateToken(user);

    return {
      success: true,
      token,
      refreshToken,
      userLoggedInWithTemporaryPassword,
    };
  } catch (error) {
    logger.error(`Error while generating the token: ${error}`);
    if (error.code) {
      throw new ErrorHandler(error.code);
    }

    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};

module.exports = { postlogin };
