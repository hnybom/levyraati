/**
 * Created by hnybom on 8.4.15.
 */
Router.configure({
    layoutTemplate: 'levyraatiMainLayout'
});

Router.route('/', {
    name: 'home',
    template: 'competitionsList',
    yieldRegions: {
      'competitionForm': {to: 'jumbotron'}
    },
    waitOn: function() {
        return Meteor.subscribe('competitions');
    },
    data: function() {
        return {
            competitions: Competitions.find({}, {sort: {created:-1}} )
        };
    }

});