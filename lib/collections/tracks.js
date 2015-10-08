/**
 * Created by henriny on 08/10/15.
 */

Tracks = new Mongo.Collection('tracks');

Meteor.methods({
    fetchTrackData: function (spotifyAttrs) {

        check(spotifyAttrs, {
            spotifyUri: String
        });

        var id = spotifyAttrs.spotifyUri.split(':')[2];

        var track = Tracks.findOne({id: id});

        if(Meteor.isClient || track) return track;

        var trackData = Spotify.fetchTrackData(id);
        Tracks.insert(trackData);
        return trackData;
    }
});