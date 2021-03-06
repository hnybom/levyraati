/**
 * Created by hnybom on 5.10.2015.
 */
function calculateRating(songRatings) {
    var totalRating = 0;
    for (var key in songRatings) {
        var rating = songRatings[key];
        totalRating = totalRating + rating.rating;
    }

    return (totalRating / songRatings.length).toFixed(2);;
}

function calculateResults(songs) {
    var results = songs.map(function (elem, index) {
        var rating = calculateRating(Ratings.find({songId: elem._id}).fetch());
        return {
            song: elem,
            rating: parseFloat(rating)
        };
    });
    return results;
};

function resultDialog(results, songs) {
    function compare(a,b) {
        if (a.rating < b.rating)
            return 1;
        if (a.rating > b.rating)
            return -1;
        return 0;
    }

    var sortedResults = results.sort(compare);

    var table = '';
    for(var key in sortedResults) {
        var result = sortedResults[key];
        var song = result.song;
        var ind = parseInt(key) + 1;
        table = table.concat('<tr><td>' + ind  + '</td><td>'
            + UI._globalHelpers.getUserName(song.creator) + '</td><td>'
            + song.name + '</td><td>'
            + result.rating + '</td></tr>');
    }

    bootbox.dialog({
            title:  mf('competition.end.popup.title', 'Ja tässä tulokset'),
            message: '<div class="row">  ' +
                     '<div class="col-md-12">' +
                     '<table class="table">' +
                     '<thead><tr><th>#</th><th>' + mf('competition.end.popup.user', 'Käyttäjä') +
                     '</th><th>' + mf('competition.end.popup.song', 'Biisin nimi') +
                     '</th><th>' + mf('competition.end.popup.rating', 'Tulos') + '</th></tr></thead>' +
                     '<tbody>' + table + '</tbody>' +
                     '</table></div>' +
                     '</div>',
            buttons: {
                success: {
                    label: "Ok",
                    className: "btn-success",
                    callback: function () {

                    }
                }
            }
        }
    );
}

Template.competitionEnd.helpers({
    winner: function() {
        var songs = Songs.find().fetch();
        if(songs.length == 0) return {};

        var results = calculateResults(songs);

        var winner = results.reduce(function(result, currentval) {
            if(!result.rating) {
                return currentval;
            }
            if(result.rating < currentval.rating) {
                return currentval;
            }

            return result;
        }, {});

        return winner.song;

    }
});

Template.competitionEnd.events({
    'click #seeTheResults' : function(event, template) {
        var songs = Songs.find().fetch();
        if(songs.length == 0) return {};

        var results = calculateResults(songs);
        resultDialog(results, songs);
    }
})