require('node-env-file')('.env');
const util = require('util');
const { name, description, version, homepage } = require('../package.json');
const getMessageTemplate = require('../utils/getMessageTemplate');

const statsFooter = {
  text: getMessageTemplate({
    id: 'webhook.stats.footer',
    values: [
      `https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}`,
    ],
  }),
  footer: getMessageTemplate({
    id: 'webhook.stats.appNameVersion',
    values: [
      description,
      version,
    ],
  }),
  footer_icon: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_128.png',
  ts: Math.floor(Date.now() / 1000)
};

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
          text: getMessageTemplate({ id: 'webhook.stats.title' }),
        },
        {
          text: getMessageTemplate({ id: 'webhook.stats.bestRatedSection' }),
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
              title: getMessageTemplate({
                id: 'webhook.stats.bestRatedTitle',
                values: [
                  place,
                  user,
                ],
              }),
              value: getMessageTemplate({
                id: 'webhook.stats.bestRatedDescription',
                values: [
                  score,
                  negativeCount,
                  positiveCount,
                ],
              }),
              short: false,
            };
          }),
        },
        {
          text: getMessageTemplate({ id: 'webhook.stats.bestRaterSection' }),
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
              title: getMessageTemplate({
                id: 'webhook.stats.bestRaterTitle',
                values: [
                  place,
                  rater,
                ],
              }),
              value: getMessageTemplate({
                id: 'webhook.stats.bestRaterDescription',
                values: [
                  ratings,
                  negativeCount,
                  positiveCount,
                ],
              }),
              short: false,
            };
          }),
        },
        statsFooter,
      ],
    });
  }

  return util.promisify(oab.sendWebhook)({
    username: 'oab-webhook',
    icon_url: 'https://raw.githubusercontent.com/rdig/oab/master/public/oab-logo-geometric_512.png',
    attachments: [
      {
        text: getMessageTemplate({ id: 'webhook.stats.noDataNotice' }),
      },
      statsFooter,
    ],
  });
};
