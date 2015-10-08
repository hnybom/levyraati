function sendMessage(message, template) {
    var chat = {
        message: message,
        competitionId: template.data.competitionId
    };

    Meteor.call('insertNewMessage', chat, function (error, result) {
        // display the error to the user and abort
        if (error) {
            throwError(error.reason)
        } else {
            $('#chat-btn-input').val('');
            $("#chat-panel-body").each(function () {
                var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
                this.scrollTop = scrollHeight - this.clientHeight;
            });
        }
    });
}
/**
 * Created by hnybom on 7.10.2015.
 */

Template.chat.events({
    'click #close-chat-button': function(event, template) {
        $('#chat-button').toggle();
        $('#chat-box').slideToggle();
    },
    'keypress #chat-btn-input': function(event, template) {
        if (event.charCode == 13) {

            var message = $('#chat-btn-input').val();
            if(!message || message == "") return;
            sendMessage(message, template);
        }
    },
    'click #chat-send-button': function(event, template) {
        var message = $('#chat-btn-input').val();
        if(!message || message == "") return;

        sendMessage(message, template);
    }
});

Template.chat.helpers({

});