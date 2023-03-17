const joiConfigs = {
  // when true, stops validation on the first error, otherwise returns all the errors found.
  abortEarly: false,
};

const interpretRequestTypes = ['POST', 'PUT'];

module.exports = { joiConfigs, interpretRequestTypes };
