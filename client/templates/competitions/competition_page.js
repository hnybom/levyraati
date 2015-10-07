/**
 * Created by hnybom on 7.10.2015.
 */
Template.competitionPage.events({
    'click #chat-button': function(event, template) {
        $('#chat-button').toggle();
        $('#chat-box').slideToggle();

        $("#chat-panel-body").each( function() {
            var scrollHeight = Math.max(this.scrollHeight, this.clientHeight);
            this.scrollTop = scrollHeight - this.clientHeight;
        });
    }
});