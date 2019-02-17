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
        saveDialogToSheets(oab, event, controller);
        /*
         * @NOTE Call dialogOk or else Slack will think this is an error
         */
        oab.dialogOk();
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
    },
  );
};
