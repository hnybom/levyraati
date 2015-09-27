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
            Meteor.subscribe('competitions', Meteor.userId()),
            Meteor.subscribe('users')
        ]
    },
    data: function() {
        return {
            competitions: Competitions.find({}, {sort: {created:-1}} ),
            users: Meteor.users.find()
        };
    }
});

Router.route('/competition/:_id', {
    name: 'competitionPage',
    yieldRegions: {
        'songForm': {to: 'jumbotron'}
    },
    waitOn: function() {
        return [
            Meteor.subscribe('singleCompetition', this.params._id),
            Meteor.subscribe('songs', this.params._id)
        ];
    },
    data: function() {
        return {
            competition: Competitions.findOne(this.params._id),
            songs: Songs.find({competitionId: this.params._id}, {sort: {created:-1}})
        }
    }
});

Router.route('/loginPage', {
    name: 'loginPage',
    yieldRegions: {
        'loginJumbo': {to: 'jumbotron'}
    },
});