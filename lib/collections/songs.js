Songs = new Mongo.Collection('songs');

validateSong = function (song) {
    var errors = {};
    if (!song.name) errors.name = mf('validation.song.name', 'Syötäppä nimi');
    if (!song.uri) errors.uri = mf('validation.song.uri', 'Syötäppä URI tai youtube hash');

    if(!isSpotifySong(song.uri) && !isYoutubeHash(song.uri)) {
        errors.uri = mf('validation.song.uri.not.valid', 'Eipä taida olla youtube hash tai spotify URI tämä :(');
    }

    if(Songs.find({competitionId: song.competitionId, uri: song.uri}).count() > 0) {
        errors.uri = mf('validation.song.exists.already', 'Biisi on jo mukana kilpailussa.');
    }

    return errors;
};

checkThatUserIsNotTheOwner =  function(songId) {
    var song = Songs.findOne({_id: songId});
    if(!song || song.creator == Meteor.userId()) {
        throw new Meteor.Error('invalid-competition', mf('validation.competition.valid', 'Valitse kunnollinen kilpailu'));
    }
};

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
            throw new Meteor.Error('invalid-songid', mf('validation.song.edit.own', 'Et voi muokata kuin omii biisei.'));
        }

        checkIsCompetitionOpen(song.competitionId);

        Songs.update({_id: songAttributes.songId}, {$set: {name: songAttributes.name, uri:songAttributes.uri}});
    }
});