const { name, description, version, homepage } = require('../package.json');
const getUserInfo = require('../utils/getUserInfo');

module.exports = (
  oab,
  event,
  controller,
  { userId, displayName },
  value,
) => controller.storage.users.get(
  userId,
  (storageError, data) => {
    if (storageError) {
      return oab.botkit.log(
        `Could not load the storage data for user ${displayName} (${userId})`,
        storageError,
      );
    }

    const {
      raterUser,
      raterId,
      accountableUser,
    } = data;

    return oab.startPrivateConversation(
      { user: raterId },
      async (conversationError, coversation) => {
        if (conversationError) {
          return oab.botkit.log(
            `Could not send a private message (response to a rating) to user ${raterUser} (${raterId})`,
            conversationError,
          );
        }

        coversation.say({
          attachments: [
            {
              text: `
*${displayName}* just submitted a response to your accountability rating.
_You can see all other rating submissions, (including this response), in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>_`,
            },
            {
              color: '#142a4b',
              fields: [{
                title: 'Respose',
                value,
                short: false
              }],
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        });
      }
    );
  },
);
