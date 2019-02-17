const { description, version } = require('../package.json');

module.exports = (oab, event) => {
  const helpMessage = `_${description}_ basic usage:

${'`/accountable help`'} - Displays this usage message
${'`/accountable stats`'} - Displays the ratings leaderboard
${'`/accountable submit`, `/accountable rate` or `/accountable`'} - Opens the submissions dialog

_Version: ${version}_
More info: https://github.com/rdig/oab`;
  return oab.replyPrivateDelayed(event, helpMessage);
};
