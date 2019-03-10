require('node-env-file')('.env');
const updateSheet = require('../lib/googleSheetsUpdate');
const raterResponseConversation = require('../components/raterResponseConversation');

module.exports = (
  oab,
  event,
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
      response => {
        /*
         * Log reponse to console for debugging purpouses
         */
        if (debug) {
          console.log(response);
        }
        /*
         * Send a DM to the original rater informing him that a response was posted
         */
        raterResponseConversation(
          oab,
          event,
          controller,
          { userId, displayName },
          value,
        );
      }
    );
  },
);
