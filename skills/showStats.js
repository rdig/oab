require('node-env-file')('.env');
const readSheet = require('../lib/googleSheetsRead');
const sendWebHookStats = require('../controller/sendWebHookStats');
const formatRatingData = require('../utils/formatRatingData');
const formatRaterData = require('../utils/formatRaterData');
const { description } = require('../package.json');
const getMessageTemplate = require('../utils/getMessageTemplate');

module.exports = async (controller, oab, event) => {
  try {
    return readSheet(
      'A2:F',
      values => sendWebHookStats(
        controller,
        formatRatingData(values) || [],
        formatRaterData(values) || [],
      ),
    );
  } catch (error) {
    return oab.replyPublicDelayed(
      event,
      getMessageTemplate({ id: 'webhook.stats.fetcherror' }),
    );
  }
};
