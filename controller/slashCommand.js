const util = require('util');
const accountabilityDialog = require('../components/accountabilityDialog');
const showHelp = require('../skills/showHelp');
const showStats = require('../skills/showStats');

module.exports = controller => {
  controller.on('slash_command', async (oab, event) => {
    /*
     * @NOTE Acknoledge the slash command in the 3000 ms time frame first, to
     * prevent the Timeout Slack error
     */
    oab.replyAcknowledge();

    switch (event.text) {
      /*
       * @NOTE Show public stats
       * (these need to be delayed since it's going to take a while to get them)
       */
      case 'stats': {
        return showStats(controller, oab, event);
      }
      /*
       * @NOTE Show private usage instructions
       */
      case 'help': {
        return showHelp(oab, event);
      }
      /*
       * @NOTE For everything else, we open the rating dialog
       */
      default: {
        const ratingDialog = await accountabilityDialog(oab, event);
        return oab.replyWithDialog(
          event,
          ratingDialog.asObject(),
        );
      };
    };

  })
};
