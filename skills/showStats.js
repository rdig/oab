require('node-env-file')('.env');
const readSheet = require('../controller/googleSheetsRead');
const formatRatingData = require('../utils/formatRatingData');

module.exports = async (oab, event) => {
  try {
    return readSheet(
      'A2:E',
      values => {
        let ratingMessage = 'Open Accountability Rating Statistics\n\n';
        ratingMessage += '*Best Rated:*\n\n'
        formatRatingData(values).map((entry, index) => {
          ratingMessage += `${index + 1}. ${entry[0]}, Score: _${entry[1]}_\n`;
        });
        ratingMessage += `
_All stat data is taken from:_ https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}
`
        return oab.replyPublicDelayed(event, ratingMessage);
      },
    );
  } catch (error) {
    console.log('IS THERE AN ERROR?', error);
    return oab.replyPublicDelayed(
      event,
      '`ERROR` Could not fetch sheets data. Please try again later',
    );
  }
};
