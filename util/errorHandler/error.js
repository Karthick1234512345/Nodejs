const errorStore = require('./Httpstatuscode.json');

class ErrorHandler extends Error {
  constructor(errorCode, updateMessage, errorPayloads) {
    super();
    if (errorStore[errorCode]) {
      this.code = errorCode;
      this.statusCode = errorStore[errorCode].code;
      this.errorPayloads = errorPayloads;
      if (!updateMessage) {
        this.message = errorStore[errorCode].message;
      } else {
        this.message = updateMessage;
      }
    }
  }
}
const handleError = (err, res) => {
  const {
    statusCode,
    message,
    code,
    errorPayloads,
  } = err;

  if (errorPayloads === undefined || errorPayloads.length === 0) {
    res.status(statusCode).json({
      errorCode: code,
      errorMessage: message,
    });
  } else {
    res.status(statusCode).json({
      errorCode: code,
      errorMessage: message,
      errorPayloads,
    });
  }
};
module.exports = {
  ErrorHandler,
  handleError,
};
