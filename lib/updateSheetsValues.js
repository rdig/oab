require('node-env-file')('.env');
const updateSheet = require('../lib/googleSheetsUpdate');

module.exports = (
  oab,
  controller,
  { userId, displayName },
  value,
  debug = process.env.DEBUG || false,
) => controller.storage.users.get(
  userId,
  (storageError, data) => {
    if (storageError) {
      return oab.botkit.log(
        `Could not load the storage data for user ${displayName} (${userId})`,
        storageError,
      );
    }
    const { range } = data;
    /*
     * Save the data Google Sheets
     */
    updateSheet(
      range,
      [
        [
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          value,
          null,
        ],
      ],
      debug ? console.log : () => {},
    );
  },
);
