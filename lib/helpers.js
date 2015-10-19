/**
 * Created by hnybom on 3.10.2015.
 */


var generateUsername = function(username) {
    var count;
    username = username.toLowerCase().trim().replace(" ", "");
    count = Meteor.users.find({"username": username}).count();
    if (count === 0) {
        return username;
    }
    else {
        return username + (count + 1).toString();
    }
};

isSpotifySong = function (uri) {
    if(uri) {
        if(uri.indexOf("spotify") > -1 && uri.split(':').length == 3) return true;
        return false;
    }
};

isYoutubeHash = function(hash) {
    if(hash) {
        return /[a-zA-Z0-9_-]{11}/.test(hash)
    }
};

if(Meteor.isServer) {
    Accounts.onCreateUser(function (options, user) {
        if (options && options.profile) {
            user.profile = options.profile;
        }

        if (user.services) {

            var service = _.pairs(user.services)[0];

            var serviceName = service[0];
            var serviceData = service[1];

            if('facebook' == serviceName || 'google' == serviceName) {
                user.username = generateUsername(serviceData.name);
                user.emails = [
                    {"address": serviceData.email, "verified": true}
                ];
            } else if ('github' == serviceName){
                user.username = generateUsername(serviceData.username);
                user.emails = [
                    {"address": serviceData.email, "verified": true}
                ];
            }

        }

        return user;
    });
}