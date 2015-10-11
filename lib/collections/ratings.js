/**
 * Created by hnybom on 30.9.2015.
 */
Ratings = new Mongo.Collection('ratings');

Meteor.methods({
    insertOrUpdateRating: function (ratingAttributes) {

        check(ratingAttributes, {
            rating: Number,
            songId: String,
            competitionId: String
        });

        checkIsCompetitionOpenAndUserIsNotTheOwner(ratingAttributes.competitionId);

        var user = Meteor.user();
        var extendedRating = _.extend(ratingAttributes,
            {
                'userId': user._id,
                'created': new Date()
            });

        Ratings.update({userId: extendedRating.userId,
                        songId :extendedRating.songId,
                        competitionId: extendedRating.competitionId}, {$set: {rating: extendedRating.rating}},
                        {upsert: true});

    }
});