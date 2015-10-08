/**
 * Created by hnybom on 20.4.15.
 */
Template.competitionActions.created = function() {
    Session.set('songFormErrors', {});
};

Template.competitionActions.helpers({
    errorMessage: function(field) {
        return Session.get('songFormErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('songFormErrors')[field] ? 'has-error' : '';
    },
    settings: function() {
        return {
            limit: 5,
            rules: [
                {
                    collection: Meteor.users,
                    field: "username",
                    template: Template.userPill
                }]
        }

    },
    noSongSubmitted: function() {
        return Songs.find({creator: Meteor.userId()}).count() == 0;
    },
    isCreator: function(parentContext) {

        var competition = this.competition;

        if(!this.competition && parentContext) {
            competition = parentContext.competition;
        }

        if(competition) {
            return competition.creator == Meteor.userId();
        }
        return false;
    },
    isClosed: function() {
        if(this.competition) {
            return this.competition.ended;
        }
    }
});


Template.competitionActions.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var user = Meteor.user();
        if(!user) return;

        var song = {
            name: $(e.target).find('[name=name]').val(),
            uri: $(e.target).find('[name=uri]').val(),
            competitionId: template.data.competition._id
        };

        var errors = validateSong(song);

        if (errors.name || errors.uri)
            return Session.set('songFormErrors', errors);

        Meteor.call('insertSong', song, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });

        $(e.target).find('[name=name]').val('');
        $(e.target).find('[name=uri]').val('');
    },
    'autocompleteselect input': function(event, template, user) {

        var addAttributes = {
            competitionId: template.data.competition._id,
            userId: user._id
        };

        Meteor.call('addUserToCompetition', addAttributes, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });

        $(event.target).val("");
    },
    'click .remove-user': function(event, template) {

        var removeAttributes = {
            competitionId: template.data.competition._id,
            userId: $(event.target).data('userid')
        };

        Meteor.call('removeUserFromComeptition', removeAttributes, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });

    },
    'click #end-competition': function(event, template) {
        var endAttributes = {
            competitionId: template.data.competition._id
        };

        Meteor.call('endComeptition', endAttributes, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });
    },
    'change #uri': function(event, template) {
        var $name = $('#name');
        var uri = $('#uri').val();
        if(UI._globalHelpers.isSpotify(uri)) {
            $name.addClass('loading-gif');
            $name.prop('disabled', true);
            Meteor.call('fetchTrackData', {spotifyUri: uri},
                function(error, result) {
                    $('#name').removeClass('loading-gif');
                    $name.prop('disabled', false);
                    if(!error && result.name) {
                        $('#name').val(result.artists[0].name + " - " + result.name);
                    }
                });
        } else {
            $name.val('');

        }
    }
});