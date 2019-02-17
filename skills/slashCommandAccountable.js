const accountabilityDialog = require('../components/accountabilityDialog');
const showHelp = require('./showHelp');
const showStats = require('./showStats');

module.exports = controller => {
  controller.on('slash_command', (oab, event) => {
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
       * @NOTE For everything else, we open the rating dilaog
       */
      default: {
        return oab.replyWithDialog(
          event,
          accountabilityDialog(oab).asObject(),
        );
      };
    };

  })
};
