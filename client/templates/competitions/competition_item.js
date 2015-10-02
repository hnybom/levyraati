/**
 * Created by hnybom on 8.4.15.
 */
Template.competitionItem.helpers({
    competitionOwnerStyle: function (id) {
        return Competitions.findOne(id).creator == Meteor.userId() ? "owner":"";
    }
});