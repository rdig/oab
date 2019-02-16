const appendSheet = require('./googleSheetsAppend');
const util = require('util');

module.exports = async (oab, event, debug = false) => {
  const { reason, rating, notes } = event.submission;
  const { user: currentUserId } = event;
  /*
   * Get submitting and accountable user(s)
   */
  const { user: accountableUser } =
    await util.promisify(oab.api.users.info)({
      user: event.submission.accountableUser,
    });
  const { user: currentUser } =
    await util.promisify(oab.api.users.info)({
      user: currentUserId,
    });
  /*
   * Format the user data
   */
  const userOrAnon = event.submission.userOrAnon === 'you' ?
    `${currentUser.real_name} (@${currentUser.name})`
    : 'Anonymous';
  return appendSheet(
    'A2:E',
    [
      [
        userOrAnon,
        `${accountableUser.real_name} (@${accountableUser.name})`,
        reason,
        parseInt(rating, 10),
        notes,
      ],
    ],
    debug ? console.log : () => null,
  );
};
