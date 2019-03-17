const { description, version, homepage } = require('../package.json');
const getMessageTemplate = require('../utils/getMessageTemplate');

const SLASH_COMMAND = 'oab';

module.exports = (oab, event) => oab.replyPrivateDelayed(
  event,
  getMessageTemplate({
    id: 'slashCommand.help.description',
    values: [
      description,
      `\`/${SLASH_COMMAND} help\``,
      `\`/${SLASH_COMMAND} stats\``,
      `\`/${SLASH_COMMAND} submit\` or \`/${SLASH_COMMAND} rate\` or \`/${SLASH_COMMAND}\``,
      version,
      homepage,
    ],
  }),
);
