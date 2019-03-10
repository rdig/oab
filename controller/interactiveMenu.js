require('node-env-file')('.env');
const updateSheet = require('../lib/googleSheetsUpdate');

module.exports = (
  controller,
  debug = process.env.DEBUG || false,
) => controller.on('interactive_message_callback', (oab, event) => {
  /*
   * @NOTE Acknoledge the interactive message in the 3000 ms time frame first, to
   * prevent the Timeout Slack error
   */
  oab.replyAcknowledge();

  switch (event.text) {
    case 'acknowledge': {
      controller.storage.users.get(
        event.user,
        (storageError, data) => {
          if (storageError) {
            return oab.botkit.log(
              `Could not load the storage data for user ${event.user}`,
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
                /*
                 * Just set a simple acknoledgement txt
                 */
                'Acknowledged',
                null,
              ],
            ],
            debug ? console.log : () => {},
          );
        },
      );
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

});
