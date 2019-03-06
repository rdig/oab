require('node-env-file')('.env');
const sendWebHookRating = require('../controller/sendWebHookRating');

module.exports = controller => {
  controller.on('interactive_message_callback', (oab, event) => {
    /*
     * @NOTE Acknoledge the interactive message in the 3000 ms time frame first, to
     * prevent the Timeout Slack error
     */
    oab.replyAcknowledge();

    switch (event.text) {
      /*
       * @NOTE
       */
      case 'private': {
        return oab.replyInteractive(event, {
          text: 'Ok, I will not post your rating publicly.',
          attachments: [
            {
              text: `But just so you know, all ratings are collected in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>.`,
            },
          ],
        });
      };
      /*
       * @NOTE
       */
      case 'public': {
        oab.replyInteractive(event, {
          text: 'Ok, I will publish yout rating publicly.',
          attachments: [
            {
              text: `Just so you know, all ratings are collected in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>.`,
            },
          ],
        });
        return controller.storage.users.get(
          event.user,
          (err, user_data) => {
            if (user_data) {
              const { userOrAnon, accountableUser, reason, rating, notes } = user_data;
              /*
               * Post a notification to the pre-selected channel
               */
              return sendWebHookRating(
                controller,
                userOrAnon,
                accountableUser,
                reason,
                rating,
                notes
              );
            }
          },
        );
      };
      default: {
        return false;
      };
    };

  })
};
