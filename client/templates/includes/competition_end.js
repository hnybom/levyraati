/**
 * Created by hnybom on 5.10.2015.
 */
Template.competitionEnd.helpers({
    winner: function() {
        var songs = Songs.find().fetch();
        if(songs.length == 0) return {};

        var results = songs.map(function(elem, index) {
            var rating = calculateRating(Ratings.find({songId: elem._id}).fetch());
            return {
                index: index,
                rating: rating
            };
        });

        var winner = results.reduce(function(result, currentval) {
            if(!result) {
                return currentval;
            }
            if(result.rating < currentval.rating) {
                return currentval;
            }

            return result;
        });

        return songs[winner.index];

    }, getUserName: function(song) {
        var user = Meteor.users.findOne(song.creator);
        if(user) return user.username;
        return "No one?? but whyy :(";
    },
});