/**
 * Created by hnybom on 3.10.2015.
 */


var generate_username = function(username) {
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

Accounts.onCreateUser(function (options, user) {
    if (options && options.profile) {
        user.profile = options.profile;
    }

    if (user.services) {

        var service = _.pairs(user.services)[0];

        var serviceName = service[0];
        var serviceData = service[1];

        user.emails = [
            {"address": serviceData.email, "verified": true}
        ];

        user.username = generate_username(serviceData.username);

        user.emails = [
            {"address": serviceData.email, "verified": true}
        ];

    }

    return user;
});