/**
 * Created by hnybom on 30.9.2015.
 */
Ratings = new Mongo.Collection('ratings');

Meteor.methods({
    addRating: function (ratingAttributes) {

        check(songAttributes, {
            rating: Integer,
            songId: String,
            competitionId: String
        });

        var user = Meteor.user();
        var extendedSong = _.extend(songAttributes,
            {
                'userId': user._id,
                'created': new Date()
            });

        var songId = Songs.insert(
            extendedSong
        );

        return {
            _id: songId
        };
    }
});