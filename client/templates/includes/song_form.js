/**
 * Created by hnybom on 20.4.15.
 */
Template.songForm.created = function() {
    Session.set('songFormErrors', {});
}

Template.songForm.helpers({
    errorMessage: function(field) {
        return Session.get('songFormErrors')[field];
    },
    errorClass: function (field) {
        return !!Session.get('songFormErrors')[field] ? 'has-error' : '';
    },
    getUserName: function(userId) {
        return Meteor.users.findOne(userId).username;
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
    }
});


Template.songForm.events({
    'submit form': function(e, template) {
        e.preventDefault();

        var user = Meteor.user();
        if(!user) return;

        var song = {
            name: $(e.target).find('[name=name]').val(),
            uri: $(e.target).find('[name=uri]').val(),
            competitionId: template.data.competition._id
        }

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
    "autocompleteselect input": function(event, template, user) {

        var addAttributes = {
            competitionId: template.data.competition._id,
            userId: user._id
        }

        Meteor.call('addUserToCompetition',addAttributes,  function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });

    }
});