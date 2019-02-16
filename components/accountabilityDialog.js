module.exports = oab => oab
  .createDialog(
    'Open Accountability',
    'accountability_submission_dialog',
    'Submit',
  )
  /*
   * Yourself v. Anonymous
   */
  .addSelect(
    'Submit As',
    'userOrAnon',
    null,
    [
      {
        label:'Yourself',
        value:'you',
      },
      {
        label:'Anonymous',
        value:'anon',
      },
    ],
    /*
     * Default
     */
    { value: 'you' }
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
        label:'Best',
        value:'5',
      },
      {
        label:'Good',
        value:'1',
      },
      {
        label:'Bad',
        value:'-1',
      },
      {
        label:'Worst',
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
