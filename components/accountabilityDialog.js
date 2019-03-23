const util = require('util');
const getMessageTemplate = require('../utils/getMessageTemplate');

module.exports = async (oab, event) => {
  /*
   * Get the Workspace's User List
   * @NOTE This is going to be highly inneficient once the workspace gets to ~1000 users
   */
  const { members: workspaceUsers } =
    await util.promisify(oab.api.users.list)({});
  /*
   * @TODO Pass the user values along
   * We already get them here, so we can make the `getUserInfo` util obsolete,
   * as that returns exactly these values, just for one user at a time
   */
  const filteredWorkspaceUsers = workspaceUsers
    /*
     * Remove deteled users from the list
     */
    .filter(userObject => userObject && !userObject.deleted)
    /*
     * Remove the current user
     */
    .filter(userObject => userObject && userObject.id !== event.user_id);
  return oab
    .createDialog(
      /*
      * Title
      */
      getMessageTemplate({ id: 'dialog.rating.title' }),
      'accountability_submission_dialog',
      /*
      * Submit Button
      */
      getMessageTemplate({ id: 'dialog.rating.buttonSubmit' }),
    )
    /*
    * Subject (User)
    */
    .addSelect(
      /*
      * User Select Title
      */
      getMessageTemplate({ id: 'dialog.rating.peerSelectTitle' }),
      'accountableUser',
      null,
      filteredWorkspaceUsers.map(user => user && ({
        label: user.real_name,
        value: user.id,
      })),
    )
    /*
    * Rating
    */
    .addSelect(
      /*
      * Rating Select Title
      */
      getMessageTemplate({ id: 'dialog.rating.ratingSelectTitle' }),
      'rating',
      null,
      [
        {
          label: getMessageTemplate({ id: 'dialog.rating.positive' }),
          value: '5',
        },
        {
          label: getMessageTemplate({ id: 'dialog.rating.negative' }),
          value: '-5',
        },
      ],
    )
    /*
    * Reason
    */
    .addText(
      /*
      * Reason Input Title
      */
      getMessageTemplate({ id: 'dialog.rating.reasonInputTitle' }),
      'reason',
    )
    /*
    * Notes
    */
    .addTextarea(
      /*
      * Notes Textarea Title
      */
      getMessageTemplate({ id: 'dialog.rating.detailsTextareaTitle' }),
      'notes',
      null,
      {
        /*
        * Notes Textarea Placeholder
        */
        placeholder: getMessageTemplate({ id: 'dialog.rating.detailsTextareaPlaceholder' }),
      }
    );
};
