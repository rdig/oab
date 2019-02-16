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
      /*
       * @TODO Better user submission feedback message
       */
      oab.whisper(event, 'Got it!');
      /*
       * @TODO If not anonymous post message to channel
       */
      try {
        saveDialogToSheets(oab, event);
        // call dialogOk or else Slack will think this is an error
        oab.dialogOk();
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
    },
  );
};
