/**
 * Created by hnybom on 18.10.2015.
 */

Youtube = {};

Youtube.fetchVideoData = function(id) {

    var videoResponse = Meteor.http.get(
        "https://www.googleapis.com/youtube/v3/videos?id=" + id + "&part=snippet,contentDetails,statistics,status&key=" + process.env.YOUTUBE_API_KEY,
        {
            timeout: 5000
        }
    );
    if(videoResponse.statusCode === 200){
        console.log(videoResponse.data);
        return videoResponse.data.items;
    } else{
        throw new Meteor.Error(500, "Youtube call failed with error: "+videoResponse.status_txt);
    }

};