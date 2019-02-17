const accountabilityDialog = require('../components/accountabilityDialog');

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
        return oab.replyPublicDelayed(event, 'We list the stats publicly');
      }
      /*
       * @NOTE Show private usage instructions
       */
      case 'help': {
        return oab.replyPrivateDelayed(event, 'We show a reply privately');
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
