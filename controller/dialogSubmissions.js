const saveDialogToSheets = require('../lib/saveDialogToSheets');
const interactiveMenuRatePublic = require('../components/interactiveMenuRatePublic');

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
       * @NOTE Call dialogOk or else Slack will think this is an error
       */
      oab.dialogOk();
      try {
        saveDialogToSheets(oab, event, controller);
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
      interactiveMenuRatePublic(oab, event);
    },
  );
};
