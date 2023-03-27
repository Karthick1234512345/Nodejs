const jwt = require('../../util/jwtAuth/token');
const { ErrorHandler } = require('../../util/errorHandler/error');

module.exports = async function auth(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers.authorization;

  if (!token || typeof token === 'undefined') {
    const err = new ErrorHandler('ERR_TKN_NOT_AVLBLE');
    next(err);
    return;
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  try {
    const decoded = await jwt.verifyToken(token, next);
    req.user = decoded;
    next();
  } catch (error) {
    const err = error instanceof ErrorHandler ? error : new ErrorHandler('ERR_INVLD_TKN');

    next(err);
  }
};
