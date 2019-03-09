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
    return util.promisify(oab.sendWebhook)({
      username: 'oab-webhook',
      icon_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_512.png',
      attachments: [
        {
          author_name: `@${name}`,
          author_link: homepage,
          text: `_${description}_ Rating Statistics`,
        },
        {
          text: '*Best Rated*',
          color: '#142a4b',
        },
        {
          thumb_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-icon-trophy_160.png',
          color: '#f4d55f',
          fields: topRatings.map(entry => {
            const place = entry[4];
            const user = entry[0];
            const score = entry[1];
            const positiveCount = entry[2];
            const negativeCount = entry[3];
            return {
              title: `${[place]}. ${user}`,
              value: `Score: _${score}_, Negative: _${negativeCount}_, Positive: _${positiveCount}_`,
              short: false,
            };
          }),
        },
        {
          text: '*Top Rater*',
          color: '#142a4b',
        },
        {
          color: '#f4d55f',
          fields: topRaters.map(entry => {
            const place = entry[4];
            const rater = entry[0];
            const ratings = entry[1];
            const positiveCount = entry[2];
            const negativeCount = entry[3];
            return {
              title: `${[place]}. ${rater}`,
              value: `Submissions: _${ratings}_, Negative: _${negativeCount}_, Positive: _${positiveCount}_`,
              short: false,
            };
          }),
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
