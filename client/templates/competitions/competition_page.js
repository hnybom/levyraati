/**
 * Created by hnybom on 7.10.2015.
 */
Template.competitionPage.events({
    'click #chat-button': function(event, template) {
        $('#chat-button').toggle();
        $('#chat-box').slideToggle();
    }
});