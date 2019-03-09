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
      const place = entry[4];
      const user = entry[0];
      const score = entry[1];
      const positiveCount = entry[2];
      const negativeCount = entry[3];
      ratingMessage += `${[place]}. ${user}, Score: _${score}_, Negative: _${negativeCount}_, Positive: _${positiveCount}_\n`;
    });
    topRaters.map(entry => {
      const place = entry[4];
      const rater = entry[0];
      const ratings = entry[1];
      const positiveCount = entry[2];
      const negativeCount = entry[3];
      ratersMessage += `${[place]}. ${rater}, Submissions: _${ratings}_, Negative: _${negativeCount}_, Positive: _${positiveCount}_\n`;
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
          text: `_All stats data is taken from <https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}|this spreadsheet>_`,
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
