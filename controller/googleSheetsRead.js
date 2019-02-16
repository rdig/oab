const fs = require('fs');
const { google } = require('googleapis');
const authorize = require('./googleAuthorize');
const env = require('node-env-file')('.env');

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
const listValues = (auth, range, callback) => {
  const sheets = google.sheets({
    version: 'v4',
    auth,
  });
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: process.env.spreadSheetId,
      range,
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      if (callback && typeof callback === 'function') {
        return callback(res.data.values);
      }
      console.log(res.data.values);
    },
  );
}

module.exports = (range, callback) => fs.readFile(
  // Load client secrets from a local file.
  'credentials.json',
  (err, content) => {
    if (err) {
      return console.log('Error loading Google Client secret file:', err);
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(
      JSON.parse(content),
      oAuthInstance => listValues(oAuthInstance, range, callback),
    );
  },
);
