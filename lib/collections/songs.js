Songs = new Mongo.Collection('songs');

validateSong = function (song) {
    var errors = {};
    if (!song.name) errors.name = "Please fill in a name";
    if (!song.uri) errors.uri = "Please fill in a URI";

    if(!UI._globalHelpers.isSpotify(song.uri) && !/[a-zA-Z0-9_-]{11}/.test(song.uri)) {
        errors.uri = "It seems the song is not a valid spotify uri or youtube id!";
    }

    if(Songs.find({competitionId: song.competitionId, uri: song.uri}).count() > 0) {
        errors.uri = "Song already added!";
    }

    return errors;
}

Meteor.methods({
    insertSong: function (songAttributes) {

        check(songAttributes, {
            name: String,
            uri: String,
            competitionId: String
        });

        checkIsCompetitionOpen(songAttributes.competitionId);

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
    },
    editSong: function (songAttributes) {
        check(songAttributes, {
            name: String,
            uri: String,
            songId: String
        });

        var song = Songs.findOne({_id: songAttributes.songId});
        if(song.creator != Meteor.userId()) {
            throw new Meteor.Error('invalid-songid', 'You can only edit your own songs!');
        }

        checkIsCompetitionOpen(song.competitionId);

        Songs.update({_id: songAttributes.songId}, {$set: {name: songAttributes.name, uri:songAttributes.uri}});
    }
});