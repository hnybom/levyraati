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

        var user = Meteor.user();
        var extendedRating = _.extend(ratingAttributes,
            {
                'userId': user._id,
                'created': new Date()
            });

        var rating = Ratings.findOne({
            songId: extendedRating.songId,
            competitionId: extendedRating.competitionId,
            userId: extendedRating.userId
        });
        if(rating) {

            Ratings.update({_id:rating._id}, {$set: {rating: extendedRating.rating}});
            return {
                _id: rating._id
            };
        } else {
            var ratingId = Ratings.insert(extendedRating);
            return {
                _id: ratingId
            };
        }

    }
});