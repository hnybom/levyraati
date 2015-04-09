/**
 * Created by hnybom on 8.4.15.
 */
Meteor.publish('competitions', function(options) {
    return Competitions.find();
});