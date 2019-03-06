module.exports = (oab, event) => oab.replyInteractive(event, {
  text: 'Your rating was submitted sucessfully!',
  attachments: [
    {
      title: 'Would you like to post the rating publicly?',
      callback_id: 'rate_public',
      actions: [
        {
          "text": "Yes, Share the Rating Publicly",
          "name":"public",
          "value": "public",
          "type": "button",
        },
        {
          "text": "No, Keep it Private for now",
          "name": "private",
          "value": "private",
          "type": "button",
          "style": "danger",
        },
      ],
    },
  ],
});
