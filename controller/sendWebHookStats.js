require('node-env-file')('.env');
const util = require('util');
const { name, description, version, homepage } = require('../package.json');

module.exports = (controller, topRatings, topRaters) => {
  const oab = controller.spawn({
    incoming_webhook: {
      url: process.env.webHookUrl,
    }
  });
  if (topRatings.length && topRaters.length) {
    let ratingMessage = '';
    let ratersMessage = '';
    topRatings.map(entry => {
      ratingMessage += `${entry[2]}. ${entry[0]}, Score: _${entry[1]}_\n`;
    });
    topRaters.map(entry => {
      ratersMessage += `${entry[2]}. ${entry[0]}, Submissions: _${entry[1]}_\n`;
    });

    const fields = [
        {
          title: 'Best Rated',
          value: ratingMessage,
          short: false
        },
        {
          title: 'Top Rater',
          value: ratersMessage,
          short: false
        },
    ];
    return util.promisify(oab.sendWebhook)({
      username: 'oab-webhook',
      icon_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_512.png',
      attachments: [
        {
          author_name: `@${name}`,
          author_link: homepage,
          thumb_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-icon-trophy_160.png',
          text: `_${description}_ Rating Statistics`,
          color: '#f4d55f',
          fields,
        },
        {
          text: `_All stat data is taken from:_ https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`,
          footer: `${description}, version: ${version}`,
          footer_icon: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_128.png',
          ts: Math.floor(Date.now() / 1000)
        },
      ],
    });
  }
  return util.promisify(oab.sendWebhook)({
    username: 'oab-webhook',
    icon_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_512.png',
    attachments: [
      {
        text: '_*Notice* No rating data available yet._\n_Add more submissions before invoking the `stats` script._',
        footer: `${description}, version: ${version}`,
        footer_icon: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_128.png',
        ts: Math.floor(Date.now() / 1000)
      },
    ],
  });
};
