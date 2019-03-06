require('node-env-file')('.env');
const appendSheet = require('./googleSheetsAppend');
const util = require('util');

module.exports = async (oab, event, controller, debug = process.env.DEBUG || false) => {
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
   * Save the data locally, in case we need to post it to a channel
   */
  controller.storage.users.save(
    {
      id: currentUserId,
      raterUser: currentUser.real_name,
      accountableUser: accountableUser.real_name,
      reason,
      rating,
      notes,
    },
  );

  /*
   * Save the data Google Sheets
   */
  appendSheet(
    'A2:E',
    [
      [
        `${currentUser.real_name} (@${currentUser.name})`,
        `${accountableUser.real_name} (@${accountableUser.name})`,
        reason,
        parseInt(rating, 10),
        notes,
      ],
    ],
    debug ? console.log : () => null,
  );
};
