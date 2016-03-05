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
    },
    'click .sort-date': function(event, template) {
        $('.song-grid').isotope({ sortBy : 'date', sortAscending: false });
    },
    'click .sort-score': function(event, template) {
        $('.song-grid').isotope({ sortBy : 'score', sortAscending: false });
    },
    'click .sort-name': function(event, template) {
        $('.song-grid').isotope({ sortBy : 'songname', sortAscending: true});
    }
});

Template.competitionPage.rendered = function() {
    $('.song-grid').isotope({
        itemSelector: '.song-grid-item',
        layoutMode: 'fitRows',
        getSortData: {
            songname: '.song-title',
            date: function (elem) {
                return moment($(elem).find('.created-date').text(), 'DD.MM.YYYY').toDate();
            },
            score: '.total-rating parseFloat'
        }
    });
};