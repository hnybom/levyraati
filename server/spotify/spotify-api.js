/**
 * Created by henriny on 08/10/15.
 */
Spotify = {};

//spotify:album:2tShA8neDBPFY0Bc06qEpx

Spotify.fetchTrackData = function(id) {

    var trackResponse = Meteor.http.get(
        "https://api.spotify.com/v1/tracks/" + id,
        {
            timeout: 5000
        }
    );
    if(trackResponse.statusCode === 200){
        return trackResponse.data;
    } else{
        throw new Meteor.Error(500, "Spotify call failed with error: "+trackResponse.status_txt);
    }



};