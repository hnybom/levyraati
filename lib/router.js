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
        return [
            Meteor.subscribe('competitions', Meteor.userId())
        ]
    },
    data: function() {
        return {
            competitions: Competitions.find({}, {sort: {created:-1}} )
        };
    }
});

Router.route('/competition/:_id', {
    name: 'competitionPage',
    yieldRegions: {
        'competitionActions': {to: 'jumbotron'}
    },
    waitOn: function() {
        return [
            Meteor.subscribe('singleCompetition', this.params._id),
            Meteor.subscribe('competitionSongs', this.params._id),
            Meteor.subscribe('competitionRatings', this.params._id),
            Meteor.subscribe('users')
        ];
    },
    data: function() {
        return {
            competition: Competitions.findOne(this.params._id),
            songs: Songs.find({competitionId: this.params._id}, {sort: {created:-1}}),
            users: Meteor.users.find()
        }
    }
});

Router.route('/loginPage', {
    name: 'loginPage',
    yieldRegions: {
        'loginJumbo': {to: 'jumbotron'}
    },
});