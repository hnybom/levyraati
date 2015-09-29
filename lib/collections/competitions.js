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
                'created': new Date(),
                'users': new Array()
            });

        var competitionId = Competitions.insert(
            extendedCompetition
        );

        return {
            _id: competitionId
        };
    },
    addUsersToCompetition: function (addAttributes) {
        if(!Competitions.findOne({_id:addAttributes.competitionId})) {
            throw new Meteor.Error('invalid-competitio', 'You must select a valid competition');
        }

        Competitions.update({_id: addAttributes.competitionId}, {$addToSet: {users: {$each: addAttributes.users}}})

    },
    addUserToCompetition: function (addAttributes) {
        if(!Competitions.findOne({_id:addAttributes.competitionId})) {
            throw new Meteor.Error('invalid-competitio', 'You must select a valid competition');
        }

        Competitions.update({_id: addAttributes.competitionId}, {$push: {users: addAttributes.userId}})

    },
    removeUserFromComeptition: function (removeAttributes) {
        if(!Competitions.findOne({_id:removeAttributes.competitionId})) {
            throw new Meteor.Error('invalid-competitio', 'You must select a valid competition');
        }

        Competitions.update({_id: removeAttributes.competitionId}, {$pull: {users: removeAttributes.userId}})
    }
});

