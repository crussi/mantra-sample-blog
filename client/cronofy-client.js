Cronofy = {};

var apiCall = function (apiUrl, callback) {
    // try…catch allows you to handle errors
    try {
        var response = HTTP.get(apiUrl).data;
        // A successful API call returns no error
        // but the contents from the JSON response
        callback(null, response);
    } catch (error) {
        // If the API responded with an error message and a payload
        if (error.response) {
            var errorCode = error.response.data.code;
            var errorMessage = error.response.data.message;
            // Otherwise use a generic error message
        } else {
            var errorCode = 500;
            var errorMessage = 'Cannot access the API';
        }
        // Create an Error object and return it via callback
        var myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
    }
}





Cronofy = {};

// Request Cronofy credentials for the user
//
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Cronofy.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'cronofy'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    var scope = "list_calendars create_calendar read_events create_event delete_event";
    // if (options && options.requestPermissions)
    //   scope = options.requestPermissions.join(',');

    var loginStyle = OAuth._loginStyle('cronofy', config, options);
    console.log("loginStyle: " + loginStyle);
    console.dir('here are options: ' + options);
    console.log('what is this: ' + OAuth._redirectUri('cronofy', config));

    var loginUrl =
        'https://app.cronofy.com/oauth/authorize?client_id=' + config.client_id +
        '&redirect_uri=' + OAuth._redirectUri('cronofy', config) +
        //'&redirect_uri=' + 'http://localhost:3000' +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken, options.redirectUrl)+
        '&scope='+scope+
        '&response_type=code';

    console.log(loginUrl);

    OAuth.launchLogin({
        loginService: "cronofy",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};