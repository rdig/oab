const accountabilityDialog = require('../components/accountabilityDialog');

module.exports = controller => {
  controller.on('slash_command', (oab, event) => {
    /*
     * @NOTE Acknoledge the slash command in the 3000 ms time frame first, to
     * prevent the Timeout Slack error
     */
    oab.replyAcknowledge();
    oab.replyWithDialog(
      event,
      accountabilityDialog(oab).asObject(),
    );
  })
};
