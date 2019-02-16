module.exports = controller => {
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
    (oab, event) => {
      oab.whisper(event, 'Got it!');
      // call dialogOk or else Slack will think this is an error
      oab.dialogOk();
    },
  );
};
