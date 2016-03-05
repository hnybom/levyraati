function handleSorting(event, sortBy) {
    var isSelected = $(event.target).hasClass('selected');
    $('.sort').find('a').removeClass('selected');

    if (isSelected) {
        $('.song-grid').isotope({ sortBy : 'date' , sortAscending: false});
        $('.sort').find('.sort-date').addClass('selected');
    } else {
        $('.song-grid').isotope(sortBy);
        $(event.target).addClass('selected');
    }
}
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
        handleSorting(event, {sortBy: 'date', sortAscending: false});
    },
    'click .sort-score': function(event, template) {
        handleSorting(event, { sortBy : 'score', sortAscending: false });
    },
    'click .sort-name': function(event, template) {
        handleSorting(event, { sortBy : 'songname', sortAscending: true});
    }
});

Template.competitionPage.rendered = function() {
    $('.song-grid').isotope({
        itemSelector: '.song-grid-item',
        layoutMode: 'fitRows',
        getSortData: {
            songname: '.song-title',
            date: function (elem) {
                return new Date($(elem).data('real-date'));
            },
            score: '.total-rating parseFloat'
        }
    });
};