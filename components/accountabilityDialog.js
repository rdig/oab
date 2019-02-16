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
  )
  /*
   * Subject (User)
   */
  // .addSelect(
  //   'User',
  //   'accountableUser',
  //   'users',
  // );
  /*
   * Reason
   */
  .addText(
    'Reason',
    'reason',
  );
  /*
   * Rating
   */
  // .addSelect()
  /*
   * Notes
   */
  // .addTextArea();
