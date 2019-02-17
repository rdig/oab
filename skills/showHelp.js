module.exports = (oab, event) => {
  const helpMessage = `Open Accountability Bot basic usage:

- ${'`help`'} Displays this usage message
- ${'`stats`'} Displays the ratings leaderboard
- ${'`submit`, `rate` or empty'} Opens the submissions dialog

Version: v0.0.0-alpha.0
More info: https://github.com/rdig/oab`;
  return oab.replyPrivateDelayed(event, helpMessage);
};
