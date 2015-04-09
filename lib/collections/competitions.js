/**
 * Created by hnybom on 28.3.15.
 */
Competitions = new Mongo.Collection('competitions');

validateCompetition = function (competition) {
    var errors = {};
    if (!competition.name)
        errors.name = "Please fill in a name";

    return errors;
}

Meteor.methods({
    insertCompetition: function (competitionAttributes) {
        check(competitionAttributes, {
            name: String
        });

        var user = Meteor.user();
        var extendedCompetition = _.extend(competitionAttributes,
            {
                'creator': user._id,
                'created': new Date()
            });

        var competitionId = Competitions.insert(
            extendedCompetition
        );

        return {
            _id: competitionId
        };
    }
});

