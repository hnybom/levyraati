Songs = new Mongo.Collection('songs');

validateSong = function (song) {
    var errors = {};
    if (!song.name) errors.name = "Please fill in a name";
    if (!song.uri) errors.uri = "Please fill in a URI";

    return errors;
}

Meteor.methods({
    insertSong: function (songAttributes) {

        check(songAttributes, {
            name: String,
            uri: String,
            competitionId: String
        });

        var user = Meteor.user();
        var extendedSong = _.extend(songAttributes,
            {
                'creator': user._id,
                'created': new Date()
            });

        var songId = Songs.insert(
            extendedSong
        );

        return {
            _id: songId
        };
    }
});