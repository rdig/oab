module.exports = controller => {
  controller.middleware.receive.use((bot, message, next) => {
    if (message.type === 'dialog_submission') {
      if (message.submission.number > 100) {
        bot.dialogError({
          "name":"number",
          "error":"Please specify a value below 100"
        });
        return;
      }
    }
    next();
  });

  // handle a dialog submission
  // the values from the form are in event.submission
  controller.on(
    'dialog_submission',
    (bot, message) => {
      // const submission = message.submission;
      bot.replyPrivate(message, 'Got it!');
      // call dialogOk or else Slack will think this is an error
      bot.dialogOk();
    },
  );
};
