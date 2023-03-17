const jwt = require('jsonwebtoken');
const model = require('../models');
const { ErrorHandler } = require('../util/errorHandler/error');

const generateNewAccessToken = async (body) => {
  const { refreshToken } = body;
  console.log(refreshToken, '......................refreshToken');
  try {
    const refreshTokenInfo = await model.Token.findOne({

      attributes: ['id', 'expiryDate', 'userId'],
      raw: true,
      where: { refreshToken },
    });
    if (!refreshTokenInfo) {
      console.log(refreshTokenInfo, '.....................refreshTokenInfo');
      throw new ErrorHandler('ERR_REFRESH_TOKEN_NOT_FOUND');
    }

    const expiryDate = new Date(refreshTokenInfo.expiryDate).getTime();

    if (expiryDate <= new Date()) {
      throw new ErrorHandler('ERR_REFRESH_TOKEN_EXPIRED');
    }

    const user = await model.User.findOne({ where: { id: refreshTokenInfo.userId } });

    if (!user) {
      throw new ErrorHandler('ERR_USER_NOT_FOUND');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5m' },
    );

    return {
      auth: true,
      token,
    };
  } catch (err) {
    throw new ErrorHandler((err.code) ? err.code : 'ERR_INRNL_SRVR');
  }
};

module.exports = generateNewAccessToken;
// eslint-disable-next-line no-unused-vars
// const jwt = require('jsonwebtoken');
// const model = require('../models');
// const { ErrorHandler } = require('../util/errorHandler/error');
// const { generateToken } = require('../util/jwtAuth/token');

// const generateNewAccessToken = async (body) => {
//   const { refreshToken } = body;
//   try {
//     const refreshTokenInfo = await model.Token.findOne({
//       attributes: ['id', 'expiryDate', 'userId'],
//       raw: true,
//       where: { refreshToken },
//     });
//     if (!refreshTokenInfo) {
//       console.log(refreshTokenInfo, '.....................refreshTokenInfo');
//       throw new ErrorHandler('ERR_REFRESH_TOKEN_NOT_FOUND');
//     }

//     const expiryDate = new Date(refreshTokenInfo.expiryDate).getTime();

//     if (expiryDate <= new Date()) {
//       throw new ErrorHandler('ERR_REFRESH_TOKEN_EXPIRED');
//     }

//     const user = await model.User.findOne({ where: { id: refreshTokenInfo.userId } });
//     console.log(user, '..................user');

//     if (!user) {
//       throw new ErrorHandler('ERR_USER_NOT_FOUND');
//     }

//     const { token } = await generateToken(user);
//     console.log()

//     return {
//       auth: true,
//       token,
//     };
//   } catch (err) {
//     throw new ErrorHandler((err.code) ? err.code : 'ERR_INRNL_SRVR');
//   }
// };

// module.exports = { generateNewAccessToken };
