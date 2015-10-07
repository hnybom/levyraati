/**
 * Created by hnybom on 7.10.2015.
 */
Chats = new Mongo.Collection('chats');

Meteor.methods({
    insertNewMessage: function (chatAttributes) {

        check(chatAttributes, {
            message: String,
            competitionId: String
        });

        var user = Meteor.user();
        var extendedChat = _.extend(chatAttributes,
            {
                'userId': user._id,
                'created': new Date()
            });


        var chatId = Chats.insert(extendedChat);
        return {
            _id: chatId
        };


    }
});