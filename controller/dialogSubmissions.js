require('node-env-file')('.env');
const saveDialogToSheets = require('../lib/saveDialogToSheets');

module.exports = async controller => {
  controller.middleware.receive.use((oab, event, next) => {
    if (event.type === 'dialog_submission') {
      /*
       * @TODO Validate form values
       */
    }
    next();
  });

  // handle a dialog submission
  // the values from the form are in event.submission
  controller.on(
    'dialog_submission',
    async (oab, event) => {
      try {
        // saveDialogToSheets(oab, event, controller);
        /*
         * @NOTE Call dialogOk or else Slack will think this is an error
         */
        oab.dialogOk();
      } catch (error) {
        oab.dialogError('Could not post your submission to the Spreadsheet');
      }
      oab.replyInteractive(event, {
          text: '...',
          attachments: [
              {
                  title: 'My buttons',
                  callback_id: '123',
                  attachment_type: 'default',
                  actions: [
                      {
                          "name":"yes",
                          "text": "Yes!",
                          "value": "yes",
                          "type": "button",
                      },
                      {
                         "text": "No!",
                          "name": "no",
                          "value": "delete",
                          "style": "danger",
                          "type": "button",
                          "confirm": {
                            "title": "Are you sure?",
                            "text": "This will do something!",
                            "ok_text": "Yes",
                            "dismiss_text": "No"
                          }
                      }
                  ]
              }
          ]
      });
    },
  );
};
