require('node-env-file')('.env');
const util = require('util');
const { name, description, version, homepage } = require('../package.json');

module.exports = (controller, userOrAnon, accountableUser, reason, rating, notes) => {
  const oab = controller.spawn({
    incoming_webhook: {
      url: process.env.webHookUrl,
    }
  });

  const ratingsList = {
    '5': 'Best',
    '1': 'Good',
    '-1': 'Bad',
    '-5': 'Worst',
  };

  const colorsList = {
    '5': '#19a582',
    '1': '#1571ab',
    '-1': '#1571ab',
    '-5': '#e51919',
  };

  const fields = [
      {
        title: 'Submitter',
        value: userOrAnon,
        short: true
      },
      {
        title: 'User',
        value: accountableUser,
        short: true
      },
      {
        title: 'Rating',
        value: ratingsList[rating],
        short: true
      },
      {
        title: 'Reason',
        value: reason,
        short: true
      },
  ];

  if (notes) {
    fields.push({
      title: 'Notes',
      value: notes,
      short: false
    });
  }

  util.promisify(oab.sendWebhook)({
    username: 'oab-webhook',
    icon_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_512.png',
    attachments: [
      {
        author_name: `@${name}`,
        author_link: homepage,
        title: 'Accountability Submissions',
        title_link: `https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`,
        text: `${userOrAnon === 'Anonymous' ? 'Someone' : userOrAnon} submitted a new accountability rating`,
        color: colorsList[rating],
        fields,
        footer: `${description}, version: ${version}`,
        footer_icon: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_128.png',
        ts: Math.floor(Date.now() / 1000)
      },
    ],
  });
};