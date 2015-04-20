/**
 * Created by hnybom on 8.4.15.
 */
Meteor.publish('competitions', function(options) {
    return Competitions.find();
});


Meteor.publish('singleCompetition', function(id) {
    check(id, String);
    return Competitions.find(id);
});

Meteor.publish('songs', function(competitionId){
    check(competitionId, String);
    return Songs.find({competitionId: competitionId});
})