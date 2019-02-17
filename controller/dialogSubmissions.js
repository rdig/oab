require('node-env-file')('.env');
const saveDialogToSheets = require('./saveDialogToSheets');

module.exports = async controller => {
  controller.middleware.receive.use((oab, event, next) => {
    if (event.type === 'dialog_submission') {
      /*
       * @TODO Validate form values
       */
    }
    next();
  });

  // handle a dialog submission
  // the values from the form are in event.submission
  controller.on(
    'dialog_submission',
    async (oab, event) => {
      oab.whisper(
        event,
        `Submission Successful! You can check all the other submissions here: https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`
      );
      try {
        /*
         * @NOTE Call dialogOk or else Slack will think this is an error
         * We need to call this prior to saving the actual data, since otherwise
         * Slack will declare a timeout while waiting for the google api to finish
         */
        oab.dialogOk();
        saveDialogToSheets(oab, event, controller);
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
    },
  );
};
