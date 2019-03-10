require('node-env-file')('.env');
const getUserInfo = require('../utils/getUserInfo');
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
  controller.on('dialog_submission', async (oab, event) => {
    /*
     * @NOTE Call dialogOk or else Slack will think this is an error
     */
    oab.dialogOk();
    console.log(event.callback_id);
    switch (event.callback_id) {
      case 'accountability_submission_dialog':
        try {
          const rater = await getUserInfo(oab, event.user);
          const ratee = await getUserInfo(oab, event.submission.accountableUser);
          oab.whisper(
            event,
            `Your rating was submitted successfully! *${ratee.displayName}* was also notified!
    _You can see all the other submissions in <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>_`
          );
          return saveDialogToSheets(oab, event, controller, rater, ratee);
        } catch (error) {
          return oab.dialogError('Could not post your submission to the Spreadsheet');
        }
      default: {
        return false;
      }
    }
  });
};
