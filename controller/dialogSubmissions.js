require('node-env-file')('.env');
const getUserInfo = require('../utils/getUserInfo');
const saveDialogToSheets = require('../lib/saveDialogToSheets');
const updateSheetsValues = require('../lib/updateSheetsValues');
const getMessageTemplate = require('../utils/getMessageTemplate');

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
    switch (event.callback_id) {
      /*
       * Rating Dialog
       */
      case 'accountability_submission_dialog':
        try {
          const rater = await getUserInfo(oab, event.user);
          const ratee = await getUserInfo(oab, event.submission.accountableUser);
          oab.whisper(
            event,
            getMessageTemplate({
              id: 'dialog.rating.submitSuccess',
              values: [
                ratee.displayName,
                `https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`,
              ],
            }),
          );
          return saveDialogToSheets(oab, event, controller, rater, ratee);
        } catch (error) {
          return oab.dialogError(getMessageTemplate({ id: 'dialog.rating.submitError' }));
        }
      case 'response_submission_dialog':
        try {
          const ratee = await getUserInfo(oab, event.user);
          updateSheetsValues(oab, event, controller, ratee, event.submission.response);
        } catch (error) {
          return oab.dialogError(getMessageTemplate({ id: 'dialog.rating.submitError' }));
        }
      default: {
        return false;
      }
    }
  });
};
