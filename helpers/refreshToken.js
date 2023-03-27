const jwt = require('jsonwebtoken');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateNewAccessToken = async (body) => {
  const { refreshToken } = body;

  try {
    const refreshTokenInfo = await model.tokens.findOne({
      attributes: ['id', 'expiryDate', 'userId'],
      where: { refreshToken },
    });

    if (!refreshTokenInfo) {
      throw new ErrorHandler('ERR_REFRESH_TOKEN_NOT_FOUND');
    }

    const expiryDate = new Date(refreshTokenInfo.expiryDate).getTime();

    if (expiryDate <= new Date()) {
      throw new ErrorHandler('ERR_REFRESH_TOKEN_EXPIRED');
    }

    const user = await model.users.findOne({ where: { id: refreshTokenInfo.userId } });

    if (!user) {
      throw new ErrorHandler('ERR_USER_NOT_FOUND');
    }
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      jwtSecretKey,
      { expiresIn: '1m' },
    );
    return {
      auth: true,
      accessToken,
    };
  } catch (err) {
    throw new ErrorHandler((err.code) ? err.code : 'ERR_INRNL_SRVR');
  }
};

module.exports = { generateNewAccessToken };
