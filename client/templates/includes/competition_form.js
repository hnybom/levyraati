/**
 * Created by hnybom on 8.4.15.
 */
Template.competitionForm.events({
    'submit form': function(e) {
        e.preventDefault();

        var user = Meteor.user();
        if(!user) return;

        var competition = {
            name: $(e.target).find('[name=name]').val()
        }

        var errors = validateCompetition(competition);

        if (errors.name)
            return Session.set('competitionFormErrors', errors);

        Meteor.call('insertCompetition', competition, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)

        });
    }
});

Template.competitionForm.helpers({
    settings: function() {
        return {
            position: "top",
            limit: 5,
            rules: [
                {
                    token: '@',
                    collection: Meteor.users,
                    field: "username",
                    template: Template.userPill
                }]
        }
    }
})