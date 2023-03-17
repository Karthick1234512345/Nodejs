const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
  hash: async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      try {
        return await bcrypt.hash(password, salt);
      } catch (err) {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
  compare: async (password, hash) => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      return false;
    }
  },
};
