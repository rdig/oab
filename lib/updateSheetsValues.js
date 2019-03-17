require('node-env-file')('.env');
const updateSheet = require('../lib/googleSheetsUpdate');
const raterResponseConversation = require('../components/raterResponseConversation');
const getMessageTemplate = require('../utils/getMessageTemplate');

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
         * Delete the last message (via the API directly)
         */
        oab.api.im.history(
          { channel: event.channel, count: 1 },
          (apiError, historyResponse) => {
            if (apiError) {
              return oab.botkit.log(
                `Could not get the last message for channel ${event.channel}`,
                replyError,
              );
            }
            return oab.api.chat.delete({
              channel: event.channel,
              ts: historyResponse.messages[0].ts,
            });
          },
        );
        oab.reply(event, {
          text: getMessageTemplate({ id: 'dm.response.responseSuccess' }),
        });
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
