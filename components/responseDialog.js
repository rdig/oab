const getMessageTemplate = require('../utils/getMessageTemplate');

module.exports = oab => oab
  .createDialog(
    getMessageTemplate({ id: 'dialog.response.title' }),
    'response_submission_dialog',
    getMessageTemplate({ id: 'dialog.response.buttonSubmit' }),
  )
  /*
   * Response
   */
  .addTextarea(
    getMessageTemplate({ id: 'dialog.response.textareaTitle' }),
    'response',
    null
  );
