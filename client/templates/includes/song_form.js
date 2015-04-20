/**
 * Created by hnybom on 20.4.15.
 */

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

        if (errors.name)
            return Session.set('songFormErrors', errors);

        Meteor.call('insertSong', song, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });
    }
});