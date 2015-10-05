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

                        Meteor.call('editSong', songAttributes, function(error, result) {
                            // display the error to the user and abort
                            if (error)
                                throwError(error.reason)
                        });
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
    for (key in songRatings) {
        var rating = songRatings[key];
        totalRating = totalRating + rating.rating;
    }

    return totalRating / songRatings.length;
}


Template.songItem.helpers({
    isOwner : function(song) {
      return song.creator == Meteor.userId();
    },
    getRatingsForThisSong : function(song) {
      return Ratings.find({songId:song._id});
    },
    ratingChecked : function(value) {
        var myRating = Ratings.findOne({songId:this._id, userId:Meteor.userId()});
        return myRating.rating == value ? "checked":"";
    },
    loopCount: function(count){
        var countArr = [];
        for (var i=0; i<count; i++){
            countArr.push({});
        }
        return countArr;
    },
    getUserName: function(userId) {
        var user = Meteor.users.findOne(userId);
        if(user) return user.username;
        return "";
    },
    averageRating: function(song) {
        var songRatings = Ratings.find({songId:this._id}).fetch();
        return calculateRating(songRatings);
    }
    ,
    editSongDialog : editDialog
})