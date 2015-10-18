/**
 * Created by henriny on 08/10/15.
 */

Videos = new Mongo.Collection('videos');

Meteor.methods({
    fetchVideoData: function (youtbeAttrs) {

        check(youtbeAttrs, {
            youtbeId: String
        });

        var id = youtbeAttrs.youtbeId;

        var video = Videos.findOne({id: id});

        if(Meteor.isClient || video) return video;

        var videoDatas = Youtube.fetchVideoData(id);
        if(videoDatas && videoDatas.length != 0) {
            var videoData = videoDatas[0];
            Videos.insert(videoData);
            return videoData;
        }
        return {};
    }
});