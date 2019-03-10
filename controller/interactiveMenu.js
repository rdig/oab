require('node-env-file')('.env');
const updateSheetsValues = require('../lib/updateSheetsValues');
const getUserInfo = require('../utils/getUserInfo');

module.exports = controller => controller.on(
  'interactive_message_callback',
  async (oab, event) => {
    /*
     * @NOTE Acknoledge the interactive message in the 3000 ms time frame first, to
     * prevent the Timeout Slack error
     */
    oab.replyAcknowledge();

    switch (event.text) {
      case 'acknowledge': {
        const user = await getUserInfo(oab, event.user);
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
