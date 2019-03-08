//makeApiCall();
print(spreadsheet.title);

function makeApiCall() {
      var params = {
        // The spreadsheet to request.
        spreadsheetId: '1f-Agof1fGH8WcYHE5MsslSklaj5zkoaXZebq9cf5bd4',
        // The ranges to retrieve from the spreadsheet.
        ranges: ["Sheet1!A1:D100"],  // Update placeholder value here.

        // True if grid data should be returned.
        // This parameter is ignored if a field mask was set in the request.
        includeGridData: false,  // TODO: Update placeholder value.
      };

      var request = gapi.client.sheets.spreadsheets.get(params);
      request.then(function(response) {
        // TODO: Change code below to process the `response` object:
        console.log(response.result);
      }, function(reason) {
        console.error('error: ' + reason.result.error.message);
      });
    }

    function initClient() {
      var API_KEY = 'AIzaSyCqiNxY_8-bcKtlb__yCv2OzWK-3inYBBM';

      var CLIENT_ID = '855658650220-5m1rk1v2dc9rla2hv49lgc2ruf89r513.apps.googleusercontent.com';

      // TODO: Authorize using one of the following scopes:
      //   'https://www.googleapis.com/auth/drive'
      //   'https://www.googleapis.com/auth/drive.file'
      //   'https://www.googleapis.com/auth/drive.readonly'
      //   'https://www.googleapis.com/auth/spreadsheets'
      //   'https://www.googleapis.com/auth/spreadsheets.readonly'
      var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

      gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    }

    function handleClientLoad() {
      gapi.load('client:auth2', initClient);
    }

    function updateSignInStatus(isSignedIn) {
      if (isSignedIn) {
        makeApiCall();
      }
    }

    function handleSignInClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
      gapi.auth2.getAuthInstance().signOut();
    }