const { name, description, version, homepage } = require('../package.json');

module.exports = (oab, event, controller, { userId, displayName }) => oab.startPrivateConversation(
  { user: userId },
  (conversationError, coversation) => {
    if (conversationError) {
      return oab.botkit.log(
        `Could not send a private message (after being rated) to user ${displayName} (${userId})`,
        conversationError,
      );
    }
    controller.storage.users.get(
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
          accountableUser,
          reason,
          rating,
          notes,
          timeStamp,
        } = data;

        const ratingsList = {
          '5': 'Positive',
          '-5': 'Negative',
        };

        const colorsList = {
          '5': '#19a582',
          '-5': '#e51919',
        };

        const fields = [
            {
              title: 'Rating',
              value: ratingsList[rating],
              short: false
            },
            {
              title: 'Reason',
              value: reason,
              short: false
            },
        ];

        if (notes) {
          fields.push({
            title: 'Notes',
            value: notes,
            short: false
          });
        }

        coversation.say({
          attachments: [
            {
              text: `
*${raterUser}* just submitted a new accountability rating for you.
_You can see all other rating submissions, (including this), in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>_`,
            },
            {
              color: colorsList[rating],
              fields,
              ts: timeStamp,
            },
          ],
        });

        coversation.ask({
          attachments: [
            {
              text: `Would you like to respond to *${raterUser}'s* rating of you ?`,
              callback_id: 'rating_response_from_dm',
              actions: [
                {
                  "text": "Respond",
                  "name":"respond",
                  "value": "respond",
                  "type": "button",
                  "style": "primary",
                },
                {
                  "text": "Acknowledge",
                  "name":"acknowledge",
                  "value": "acknowledge",
                  "type": "button",
                },
                {
                  "text": "Ignore",
                  "name": "ignore",
                  "value": "ignore",
                  "type": "button",
                  "style": "danger",
                },
              ],
            },
          ],
        });
      },
    );
  },
);
