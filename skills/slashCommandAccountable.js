const accountabilityDialog = require('../components/accountabilityDialog');

module.exports = controller => {
  controller.on('slash_command', (oab, event) => {
    // bot.replyPrivate(
    //   message,
    //   'Your accountability submission remains secret...',
    // );
    oab.replyWithDialog(
      event,
      accountabilityDialog(oab).asObject(),
    );
  })
};
