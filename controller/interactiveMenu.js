require('node-env-file')('.env');
const updateSheetsValues = require('../lib/updateSheetsValues');
const getUserInfo = require('../utils/getUserInfo');
const responseDialog = require('../components/responseDialog');

module.exports = controller => controller.on(
  'interactive_message_callback',
  async (oab, event) => {
    /*
     * @NOTE Acknoledge the interactive message in the 3000 ms time frame first, to
     * prevent the Timeout Slack error
     */
    oab.replyAcknowledge();
    const user = await getUserInfo(oab, event.user);
    switch (event.text) {
      case 'respond': {
        const { displayName, userId } = user;
        /*
         * Spawn the reponse dialog
         */
        return oab.replyWithDialog(
          event,
          responseDialog(oab).asObject(),
          (replyError, response) => {
            if (replyError) {
              return oab.botkit.log(
                `Could not create the response dialog user ${displayName} (${userId})`,
                replyError,
              );
            }
            /*
             * Delete the last message (via the API directly)
             */
            bot.api.im.history(
              { channel: event.channel, count: 1 },
              (apiError, historyResponse) => {
                if (apiError) {
                  return oab.botkit.log(
                    `Could not get the last message for channel ${event.channel}`,
                    replyError,
                  );
                }
                return bot.api.chat.delete({
                  channel: event.channel,
                  ts: historyResponse.messages[0].ts,
                });
              },
            );
          },
        );
      }
      case 'acknowledge': {
        updateSheetsValues(oab, controller, user, 'Acknowledged');
        return oab.replyInteractive(event, {
          text: "Ok! I've sent an acknowledgement on your behalf."
        });
      }
      case 'ignore': {
        return oab.replyInteractive(event, {
          text: "Got it! You don't have to take any further action."
        });
      }
      default: {
        return false;
      };
    };
  },
);
