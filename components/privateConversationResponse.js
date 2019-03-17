const { name, description, version, homepage } = require('../package.json');
const getMessageTemplate = require('../utils/getMessageTemplate');

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
          '5': getMessageTemplate({ id: 'dm.rating.positive' }),
          '-5': getMessageTemplate({ id: 'dm.rating.negative' }),
        };

        const colorsList = {
          '5': '#19a582',
          '-5': '#e51919',
        };

        const fields = [
            {
              title: getMessageTemplate({ id: 'dm.rating.title' }),
              value: ratingsList[rating],
              short: false
            },
            {
              title: getMessageTemplate({ id: 'dm.rating.reasonTitle' }),
              value: reason,
              short: false
            },
        ];

        if (notes) {
          fields.push({
            title: getMessageTemplate({ id: 'dm.rating.detailsTitle' }),
            value: notes,
            short: false
          });
        }

        coversation.say({
          attachments: [
            {
              text: getMessageTemplate({
                id: 'dm.rating.description',
                values: [
                  raterUser,
                  `https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`,
                ],
              }),
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
              text: getMessageTemplate({
                id: 'dm.rating.askDescription',
                values: [
                  raterUser,
                ],
              }),
              callback_id: 'rating_response_from_dm',
              actions: [
                {
                  "text": getMessageTemplate({ id: 'dm.rating.buttonRespond' }),
                  "name":"respond",
                  "value": "respond",
                  "type": "button",
                  "style": "primary",
                },
                {
                  "text": getMessageTemplate({ id: 'dm.rating.buttonAcknowledge' }),
                  "name":"acknowledge",
                  "value": "acknowledge",
                  "type": "button",
                },
                {
                  "text": getMessageTemplate({ id: 'dm.rating.buttonIgnore' }),
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
