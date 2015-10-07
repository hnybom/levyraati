/**
 * Created by hnybom on 7.10.2015.
 */

Template.chat.events({
    'click #close-chat-button': function(event, template) {
        $('#chat-button').toggle();
        $('#chat-box').slideToggle();
    },
    'click #chat-send-button': function(event, template) {
        var message = $('#chat-btn-input').val();
        var chat = {
            message: message,
            competitionId: template.data.competitionId
        };

        Meteor.call('insertNewMessage', chat, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });

        $('#chat-btn-input').val('');
    }
});

Template.chat.helpers({

});