/**
 * Created by hnybom on 8.4.15.
 */
Router.configure({
    layoutTemplate: 'levyraatiMainLayout',
    loadingTemplate: 'loading',
    defaultBreadcrumbLastLink: true
});

Router.route('/', {
    name: 'home',
    title: 'Home',
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
            openCompetitions: Competitions.find({ended: {$exists: false}}, {sort: {created:-1}}),
            closedCompetitions: Competitions.find({ended: true}, {sort: {created:-1}, limit: 10})
        };
    }
});

Router.route('/competition/:_id', {
    name: 'competitionPage',
    parent: 'home',
    title: function() {
        var competition = Competitions.findOne(this.params._id);
        if(competition) return competition.name;
        return "";
    },
    yieldRegions: {
        'competitionActions': {to: 'jumbotron'}
    },
    waitOn: function() {
        return [
            Meteor.subscribe('competitionSongs', this.params._id),
            Meteor.subscribe('competitionRatings', this.params._id),
            Meteor.subscribe('competitionChat', this.params._id),
            Meteor.subscribe('users'),
            Meteor.subscribe('competitions', Meteor.userId())
        ];
    },
    data: function() {
        return {
            ownCompetitions: Competitions.find(),
            competition: Competitions.findOne(this.params._id),
            songs: Songs.find({competitionId: this.params._id}, {sort: {created:-1}}),
            chats: Chats.find({competitionId: this.params._id}, {sort: {created:1}}),
            users: Meteor.users.find()
        }
    }
});

Router.route('/loginPage', {
    name: 'loginPage',
    parent: 'home',
    yieldRegions: {
        'loginJumbo': {to: 'jumbotron'}
    },
});

var requireLogin = function() {

    if (! Meteor.user()) {
        if(Meteor.loggingIn()) {
            this.render(this.loadingTemplate)
        } else {
            this.render('loginPage');
            this.render('loginJumbo', {to:"jumbotron"});
        }

    } else {
        this.next();
    }
};

var requireThatIsPartOfCompetition = function() {
    var routeName = this.route.getName();
    if(routeName.indexOf('competitionPage') >= 0) {
        var comp = Competitions.findOne(this.params._id);
        if(!comp) Router.go('home');
    }
    this.next();

};

var disableTranslate = function() {
    var routeName = this.route.getName();
    if(routeName.indexOf('mfTrans') >= 0) {
        Router.go('home');
    }
    this.next();
}

if(Meteor.isClient) {
    Router.onBeforeAction(disableTranslate);
    Router.onBeforeAction(requireLogin);
    Router.onBeforeAction(requireThatIsPartOfCompetition);
}