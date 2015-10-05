/**
 * Created by hnybom on 5.10.2015.
 */
Template.songPlayer.helpers({
    isSpotify: function isSpotifySong(song) {
        if(song) {
            if(song.uri.indexOf("spotify") > -1) return true;
            return false;
        }
    }
});