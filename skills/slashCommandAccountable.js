const accountabilityDialog = require('../components/accountabilityDialog');

module.exports = controller => {
  controller.on('slash_command', (bot, message) => {
    // bot.replyPrivate(
    //   message,
    //   'Your accountability submission remains secret...',
    // );
    bot.replyWithDialog(
      message,
      accountabilityDialog(bot).asObject(),
    );
  })
};
