require('node-env-file')('.env');
const readSheet = require('../controller/googleSheetsRead');
const formatRatingData = require('../utils/formatRatingData');
const formatRaterData = require('../utils/formatRaterData');
const { description } = require('../package.json');

module.exports = async (oab, event) => {
  try {
    return readSheet(
      'A2:E',
      values => {
        let ratingMessage = `_${description}_ Rating Statistics

`;
        const ratingValues = formatRatingData(values);
        if (ratingValues.length) {
          ratingMessage += '*Best Rated:*\n\n'
          ratingValues.map(entry => {
            ratingMessage += `${entry[2]}. ${entry[0]}, Score: _${entry[1]}_\n`;
          });
          ratingMessage += `
*Top Rater:*

`;
          formatRaterData(values).map(entry => {
            ratingMessage += `${entry[2]}. ${entry[0]}, Submissions: _${entry[1]}_\n`;
          });
          ratingMessage += `
_All stat data is taken from:_ https://docs.google.com/spreadsheets/d/${process.env.spreadSheetId}
`
        } else {
          ratingMessage +=
            '_*Notice* No rating data available yet. Add new submissions before invoking the `stats` script._';
        }
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
