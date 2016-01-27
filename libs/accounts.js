Accounts.oauth.registerService('cronofy');

if (Meteor.isClient) {
    Meteor.loginWithCronofy = function(options, callback) {
        // support a callback without options
        if (! callback && typeof options === "function") {
            callback = options;
            options = null;
        }

        var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
        Cronofy.requestCredential(options, credentialRequestCompleteCallback);
    };
} else {
    Accounts.addAutopublishFields({
        // publish all fields including access token, which can legitimately
        // be used from the client (if transmitted over ssl or on
        // localhost). https://developers.facebook.com/docs/concepts/login/access-tokens-and-types/,
        // "Sharing of Access Tokens"
        forLoggedInUser: ['services.cronofy'],
        // forOtherUsers: [
        //   // https://www.facebook.com/help/167709519956542
        //   'services.facebook.id', 'services.facebook.username', 'services.facebook.gender'
        // ]
    });
}

if (Meteor.isServer) {
    Accounts.onCreateUser(function(options, user){
        console.log("Accounts.onCreateUser");
        if (user.services && user.services.cronofy) {
            console.log("user authorized with Cronofy");
            if (Meteor.user()) {
                console.log("there is a logged in user:");
                //console.dir(Meteor.user());

            } else {
                console.log("there is NO logged in user");
            }
        } else if (user.services && user.services.google) {
            console.log("user authorized with google");
        }
        //console.dir(user);
        return user;
    });

    Accounts.validateNewUser(function(user){
        if (user.services && user.services.cronofy) {
            console.log("prevent new Cronofy user");
            if (Meteor.user()) {
                console.log("there is a logged in user:");
                //console.dir(Meteor.user());
                //TODO: consoldate calls to update accesstoken, refreshtoken
                var loggedInUser = Meteor.users.findOne({_id:Meteor.userId()});
                Meteor.users.update({_id:loggedInUser._id},{$set:{"services.cronofy":user.services.cronofy}});
            } else {
                console.log("there is NO logged in user");
            }
            return false;
        } else if (user.services && user.services.google) {
            console.log("allow new Google user");
            return true;
        }
    })
}
