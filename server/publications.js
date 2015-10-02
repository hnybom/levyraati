/**
 * Created by hnybom on 8.4.15.
 */
Meteor.publish('competitions', function(userId) {
    return Competitions.find({$or: [{creator: userId}, {users: userId}]});
});

Meteor.publish('singleCompetition', function(id) {
    check(id, String);
    return Competitions.find(id);
});

Meteor.publish('competitionSongs', function(competitionId){
    check(competitionId, String);
    return Songs.find({competitionId: competitionId});
});

Meteor.publish('competitionRatings', function(competitionId){
    check(competitionId, String);
    return Ratings.find({competitionId: competitionId});
})

Meteor.publish('users', function() {
    return Meteor.users.find({}, {fields: {'_id': 1, 'username':1}});
});