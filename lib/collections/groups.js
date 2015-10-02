/**
 * Created by hnybom on 28.3.15.
 */
Groups = new Mongo.Collection('groups');


Meteor.methods({
    insertGroup: function (users) {

        var user = Meteor.user();
        var group = {
                'creator': user._id,
                'users': users
        };

        var groupId = Groups.insert(group);

        return {
            _id: groupId
        };
    }
});

