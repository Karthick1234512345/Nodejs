const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const model = require('./models');
const { ErrorHandler } = require('./util/errorHandler/error');

const postlogin = async (req) => {
  const { email, password } = req;

  try {
    if (!email || !password) {
      throw new ErrorHandler('ERR_MNDTR_PRM_MSNG');
    }
    const User = await model.User.findOne({ where: { Email: email } });
    if (!User) {
      throw new ErrorHandler('ERR_INVALID_EMAIL_OR_PASSWORD');
    }
    let userLoggedInWithTemporaryPassword = false;
    if (User.dataValues.temproaryPassword) {
      // eslint-disable-next-line max-len
      const isTemporaryPasswordValid = await bcrypt.compare(password, User.dataValues.temproaryPassword);
      if (!isTemporaryPasswordValid) {
        throw new ErrorHandler('ERR_INVALID_EMAIL_OR_PASSWORD');
      }
      if (new Date() > User.tempPasswordExpiry) {
        throw new ErrorHandler('ERR_TMPR_PWD_EXPIRED');
      }
      userLoggedInWithTemporaryPassword = true;
    } else {
      const isPermanentPassword = await bcrypt.compare(password, User.permanentPassword);
      if (!isPermanentPassword) {
        throw new ErrorHandler('ERR_INVALID_EMAIL_OR_PASSWORD');
      }
    }

    // Generate JWT token
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const tokenPayload = {
      userId: User.id,
      email: User.email,
    };
    const token = jwt.sign(tokenPayload, jwtSecretKey, { expiresIn: '1h' });

    // Generate refresh token
    const jwtRefreshSecretKey = process.env.JWT_REFRESH_SECRET_KEY;
    const refreshTokenPayload = {
      userId: User.id,
      email: User.email,
    };
    const refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecretKey, { expiresIn: '7d' });

    // Save the refresh token in the database
    await model.Token.create({
      token: refreshToken,
      userId: User.id,
      type: 'refresh',
    });

    return {
      success: true,
      token,
      refreshToken,
      userLoggedInWithTemporaryPassword,
    };
  } catch (error) {
    if (error.code) {
      throw new ErrorHandler(error.code);
    }
    throw new ErrorHandler('ERR_INRNL_SRVR');
  }
};
module.exports = { postlogin };
