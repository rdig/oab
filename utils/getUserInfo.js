const util = require('util');

module.exports = async (oab, userId) => {
  const {
    user: {
      real_name: displayName,
      name: username,
    },
  } = await util.promisify(oab.api.users.info)({ user: userId });
  return {
    userId,
    username,
    displayName,
  };
};
