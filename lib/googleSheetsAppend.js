require('node-env-file')('.env');
const fs = require('fs');
const { google } = require('googleapis');
const authorize = require('./googleAuthorize');

function insertValues(auth, range, values, callback) {
  const sheets = google.sheets({
    version: 'v4',
    auth
  });
  sheets.spreadsheets.values.append(
    {
      spreadsheetId: process.env.spreadSheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values,
      },
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      if (callback && typeof callback === 'function') {
        return callback(
          Object.assign(
            {},
            JSON.parse(res.config.data),
            res.data,
          ),
        );
      }
      console.log(res.status);
      console.log(res.statusText);
      console.log(res.config.data);
      console.log(res.data);
    },
  );
}

module.exports = (range, values, callback) => fs.readFile(
  // Load client secrets from a local file.
  'credentials.json',
  (err, content) => {
    if (err) {
      return console.log('Error loading Google Client secret file:', err);
    }
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(
      JSON.parse(content),
      oAuthInstance => insertValues(oAuthInstance, range, values, callback),
    );
  },
);
