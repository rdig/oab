module.exports = oab => oab
  .createDialog(
    'Open Accountability',
    'accountability_submission_dialog',
    'Submit',
  )
  /*
   * Subject (User)
   */
  .addSelect(
    'User',
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
    'Rating',
    'rating',
    null,
    [
      {
        label:'Positive',
        value:'5',
      },
      {
        label:'Negative',
        value:'-5',
      },
    ],
  )
  /*
   * Reason
   */
  .addText(
    'Reason',
    'reason',
  )
  /*
   * Notes
   */
  .addTextarea(
    'Additional Notes',
    'notes',
    null,
    {
      placeholder: 'Optional explanation for your reasoning',
      optional: true,
    }
  );
