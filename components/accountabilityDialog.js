const getMessageTemplate = require('../utils/getMessageTemplate');

module.exports = oab => oab
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
    null,
    /*
     * Slack provides us with a list of users. Neat!
     */
    { data_source: 'users' },
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
        value:'5',
      },
      {
        label: getMessageTemplate({ id: 'dialog.rating.negative' }),
        value:'-5',
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
      optional: true,
    }
  );
