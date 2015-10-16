/**
 * Created by hnybom on 28.3.15.
 */
Competitions = new Mongo.Collection('competitions');

validateCompetition = function (competition) {
    var errors = {};
    if (!competition.name)
        errors.name = mf('validation.competition.name', 'Täytäppä nimi kans');
    if (!competition.description)
        errors.description = mf('validation.competition.desc', 'Täytäppä kuvaus kans');

    return errors;
};

checkIsCompetitionOpen = function(competitionId) {
    var competition = Competitions.findOne({_id: competitionId});
    if(!competition || competition.ended) {
        throw new Meteor.Error('invalid-competition', mf('validation.competition.closed', 'Sori kilpailu on suljettu'));
    }
};

checkIsCompetitionOpenAndUserIsNotTheOwner =  function(competitionId) {
    var competition = Competitions.findOne({_id: competitionId});
    if(!competition || competition.ended ||  competition.creator == Meteor.userId()) {
        throw new Meteor.Error('invalid-competition', mf('validation.competition.valid', 'Valitse kunnollinen kilpailu'));
    }
};

checkIsCompetitionOpenAndUserIsTheOwner = function(competitionId) {
    var competition = Competitions.findOne({_id: competitionId});
    if(!competition || competition.ended ||  competition.creator != Meteor.userId()) {
        throw new Meteor.Error('invalid-competition', mf('validation.competition.valid'));
    }
};

Meteor.methods({
    insertCompetition: function (competitionAttributes) {
        check(competitionAttributes, {
            name: String,
            description: String
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
    endComeptition: function (endAttributes) {

        var competition = Competitions.findOne({_id: endAttributes.competitionId});
        if(!competition || competition.creator != Meteor.userId()) {
            throw new Meteor.Error('invalid-competition', mf('validation.competition.valid'));
        }
        Competitions.update({_id: endAttributes.competitionId}, {$set: {ended: true}});
    },
    addUsersToCompetition: function (addAttributes) {
        checkIsCompetitionOpenAndUserIsTheOwner(addAttributes.competitionId);

        Competitions.update({_id: addAttributes.competitionId}, {$addToSet: {users: {$each: addAttributes.users}}})

    },
    addUserToCompetition: function (addAttributes) {

        var competition = Competitions.findOne({_id: addAttributes.competitionId});
        if(!competition || competition.ended) {
            throw new Meteor.Error('invalid-competition', mf('validation.competition.valid'));
        }
        if(_.contains(competition.users, addAttributes.userId)) return;

        Competitions.update({_id: addAttributes.competitionId}, {$push: {users: addAttributes.userId}})

    },
    removeUserFromComeptition: function (removeAttributes) {
        checkIsCompetitionOpenAndUserIsTheOwner(removeAttributes.competitionId);

        Competitions.update({_id: removeAttributes.competitionId}, {$pull: {users: removeAttributes.userId}})
    }
});

