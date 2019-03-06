require('node-env-file')('.env');
const readSheet = require('../lib/googleSheetsRead');
const sendWebHookStats = require('../controller/sendWebHookStats');
const formatRatingData = require('../utils/formatRatingData');
const formatRaterData = require('../utils/formatRaterData');
const { description } = require('../package.json');

module.exports = async (controller, oab, event) => {
  try {
    return readSheet(
      'A2:E',
      values => sendWebHookStats(
        controller,
        formatRatingData(values) || [],
        formatRaterData(values) || [],
      ),
    );
  } catch (error) {
    return oab.replyPublicDelayed(
      event,
      '`ERROR` Could not fetch sheets data. Please try again later',
    );
  }
};
