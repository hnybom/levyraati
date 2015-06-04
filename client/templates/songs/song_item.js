/**
 * Created by hnybom on 31.5.15.
 */

Template.songItem.helpers({
    isSpotify : function(song) {
        if(song.uri.indexOf("spotify") > -1) return true;
        return false;
    }
})