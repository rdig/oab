module.exports = oab => oab
  .createDialog(
    'Response',
    'response_submission_dialog',
    'Respond',
  )
  /*
   * Response
   */
  .addTextarea(
    'Accountability Rating Response',
    'response',
    null,
    {
      placeholder: "While the reponse is optional, it's highly recommended",
      optional: true,
    }
  );
