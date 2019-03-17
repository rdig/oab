require('node-env-file')('.env');
const updateSheetsValues = require('../lib/updateSheetsValues');
const getUserInfo = require('../utils/getUserInfo');
const responseDialog = require('../components/responseDialog');
const getMessageTemplate = require('../utils/getMessageTemplate');

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
        );
      }
      case 'acknowledge': {
        updateSheetsValues(
          oab,
          event,
          controller,
          user,
          getMessageTemplate({ id: 'dm.rating.acknowledgeText' }),
        );
        return oab.replyInteractive(event, {
          text: getMessageTemplate({ id: 'dm.response.acknowledgeSuccess' }),
        });
      }
      case 'ignore': {
        return oab.replyInteractive(event, {
          text: getMessageTemplate({ id: 'dm.response.ignoreSuccess' }),
        });
      }
      default: {
        return false;
      };
    };
  },
);
