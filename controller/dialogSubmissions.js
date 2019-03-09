require('node-env-file')('.env');
const util = require('util');
const saveDialogToSheets = require('../lib/saveDialogToSheets');

module.exports = async controller => {
  controller.middleware.receive.use((oab, event, next) => {
    if (event.type === 'dialog_submission') {
      /*
       * @TODO Validate form values
       */
    }
    next();
  });

  /*
   * Handle a dialog submission
   */
  controller.on(
    'dialog_submission',
    async (oab, event) => {
      /*
       * @NOTE Call dialogOk or else Slack will think this is an error
       */
      oab.dialogOk();
      /*
       * Get the user that was just rated,
       * so we can use it in the confirmation message
       *
       * @TODO Reduce code repetition
       * This is used both here and inside `saveDialogToSheets`.
       * Maybe find a way to call this method just once.
       */
      const { user: { real_name: accountableUser } } =
        await util.promisify(oab.api.users.info)({
          user: event.submission.accountableUser,
        });
      oab.whisper(
        event,
        `Your rating was submitted successfully! *${accountableUser}* was aslo notified!
_You can see all the other submissions in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>_`
      );
      try {
        saveDialogToSheets(oab, event, controller);
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
    },
  );
};
