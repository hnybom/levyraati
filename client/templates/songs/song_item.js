/**
 * Created by hnybom on 31.5.15.
 */
function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function editDialog(song) {
    bootbox.dialog({
            title: "Edit song info",
            message: '<div class="row">  ' +
            '<form class="form"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="name">Name</label> ' +
            '<div class="col-md-10"> ' +
            '<input id="name" name="name" type="text" placeholder="" class="form-control input-md" value="' + escapeHtml(song.name) + '"> ' +
            '<span class="help-block">New name for the song</span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="uri">URI</label> ' +
            '<div class="col-md-10"> ' +
            '<input id="uri" name="uri" type="text" placeholder="" class="form-control input-md" value="' + escapeHtml(song.uri) + '"> ' +
            '<span class="help-block">New URI for the song</span> </div> ' +
            '</div> ' +
            '</div> </div>' +
            '</form></div>',
            buttons: {
                success: {
                    label: "Save",
                    className: "btn-success",
                    callback: function () {
                        var name = $('#name').val();
                        var uri = $('#uri').val();
                        var songAttributes = {
                            songId: song._id,
                            name: name,
                            uri: uri
                        }
                        var errors = validateSong(songAttributes);

                        if (errors.name || errors.uri) {
                            sAlert.error('Sorry song info not valid!');
                        } else {
                        Meteor.call('editSong', songAttributes, function(error, result) {
                            // display the error to the user and abort
                            if (error)
                                throwError(error.reason)
                        });
                        }
                    }
                }
            }
        }
    );
}

Template.songItem.events({
    'click .edit-song': function(event, template) {
        var songId = $(event.target).data('songid');
        editDialog(Songs.findOne({_id: songId}));
    },
    'click .starRating input': function(event, template) {

        var ratingData = {
            rating: parseInt(event.target.value),
            songId: this._id,
            competitionId: this.competitionId
        }

        Meteor.call('insertOrUpdateRating', ratingData, function(error, result) {
            // display the error to the user and abort
            if (error)
                throwError(error.reason)
        });
    }
})

function calculateRating(songRatings) {
    var totalRating = 0;
    if(songRatings.length == 0) return totalRating;
    for (key in songRatings) {
        var rating = songRatings[key];
        totalRating = totalRating + rating.rating;
    }

    return totalRating / songRatings.length;
}
function isOwner(song) {
    return song.creator == Meteor.userId();
}

Template.songItem.helpers({
    isOwner : isOwner,
    inc : function(val) {
        return val + 1;
    },
    getRatingsForThisSong : function(song) {
      return Ratings.find({songId:song._id});
    },
    ratingChecked : function(value) {
        var myRating = Ratings.findOne({songId:this._id, userId:Meteor.userId()});
        if(myRating) return myRating.rating == value ? "checked":"";
        return "";
    },
    isOkToEdit: function() {
        if(!isOwner(this)) return false;

        var competition = Competitions.findOne(this.competitionId);
        if(competition) return !competition.ended;
        return false;
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=0; i<count; i++){
            countArr.push({});
        }
        return countArr;
    },
    averageRating: function(song) {
        var songRatings = Ratings.find({songId:this._id}).fetch();
        return calculateRating(songRatings);
    },
    getSongBackground: function() {
        // Disabled for now.
        if(true) return "song-bg2";

        var mod = Math.floor(Math.random() * 5)
        if(mod == 0) {
            return "song-bg1";
        }
        if(mod == 1) {
            return "song-bg2";
        }
        if(mod == 2) {
            return "song-bg3";
        }
        if(mod == 3) {
            return "song-bg4";
        }
        if(mod == 4) {
            return "song-bg5";
        }

        return "song-bg2";
    },
    editSongDialog : editDialog
});