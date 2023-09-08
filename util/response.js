exports.SuccessResponse =  function (data = null, message = null) {
  return {
    code: 0, message: message, data
  }
};

exports.ErrorResponse =  function (code, errors, message = null, data = null) {
  return {
    code, message, data, errors
  }
};
