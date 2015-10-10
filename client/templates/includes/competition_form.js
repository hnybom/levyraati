/**
 * Created by hnybom on 8.4.15.
 */
Template.competitionForm.helpers({
    errorMessage: function(field) {
        return Session.get('competitionFormErrors')[field];
    }
});

Template.competitionForm.events({
    'submit form': function(e) {
        e.preventDefault();

        var user = Meteor.user();
        if(!user) return;

        var competition = {
            name: $(e.target).find('[name=name]').val(),
            description: $(e.target).find('#description').val()
        };

        var errors = validateCompetition(competition);

        if (errors.name || errors.description) {
            return Session.set('competitionFormErrors', errors);
        } else {
            Session.set('competitionFormErrors', {});
        }

        Meteor.call('insertCompetition', competition, function(error, result) {
            // display the error to the user and abort
            if (error) {
                throwError(error.reason)
            } else {
                $(e.target).find('[name=name]').val('');
                $(e.target).find('#description').val('');
            }

        });
    }
});
