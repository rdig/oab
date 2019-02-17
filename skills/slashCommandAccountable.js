const accountabilityDialog = require('../components/accountabilityDialog');

module.exports = controller => {
  controller.on('slash_command', (oab, event) => {
    oab.replyWithDialog(
      event,
      accountabilityDialog(oab).asObject(),
    );
  })
};
