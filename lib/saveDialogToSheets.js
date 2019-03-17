require('node-env-file')('.env');
const appendSheet = require('./googleSheetsAppend');
const privateConversationResponse = require('../components/privateConversationResponse');

module.exports = async (
  oab,
  event,
  controller,
  rater,
  ratee,
  debug = process.env.DEBUG || false,
) => {
  const { reason, rating, notes } = event.submission;
  const timeStamp = Math.floor(Date.now() / 1000);

  /*
   * Save the data Google Sheets
   */
  appendSheet(
    'A2:H',
    [
      [
        rater.displayName,
        `@${rater.username}`,
        ratee.displayName,
        `@${ratee.username}`,
        reason,
        parseInt(rating, 10),
        notes,
        /*
         * Response, we're not setting this here
         * We have to wait for the rated user to actually respond
         */
        null,
        timeStamp,
      ],
    ],
    response => {
      /*
       * Log reponse to console for debugging purpouses
       */
      if (debug) {
        console.log(response);
      }
      controller.storage.users.save(
        {
          id: ratee.userId,
          raterId: rater.userId,
          raterUser: rater.displayName,
          accountableUser: ratee.displayName,
          reason,
          rating,
          notes,
          timeStamp,
          range: response.updates.updatedRange,
        },
        (storageError) => {
          if (storageError) {
            return oab.botkit.log(
              `Could not load the storage data for user ${ratee.displayName} (${ratee.userId})`,
              storageError,
            );
          }
          /*
           * Send a DM to the ratee informing him that he was just rated
           */
          privateConversationResponse(oab, event, controller, ratee);
        }
      );
    },
  );
};
