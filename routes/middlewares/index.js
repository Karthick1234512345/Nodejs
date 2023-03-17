/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const configs = require('./validator-config');

let validators = {};

require('fs').readdirSync(require('path').join(__dirname, './helpers')).forEach((file) => {
  validators = {
    ...validators,
    ...require(`./helpers/${file}`),
  };
});

module.exports = {
  validators,
  configs,
};
