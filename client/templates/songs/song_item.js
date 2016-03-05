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
            title: mf('song.edit.title', 'Muokkaa biisin tietoja'),
            message: '<div class="row">  ' +
            '<form class="form"> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="name">' + mf('competition.add.song.name.label') + '</label> ' +
            '<div class="col-md-10"> ' +
            '<input id="name" name="name" type="text" placeholder="" class="form-control input-md" value="' + escapeHtml(song.name) + '"> ' +
            '<span class="help-block">' + mf('song.edit.name.help', 'Uusi nimi biisille') + '</span> </div> ' +
            '</div> ' +
            '<div class="form-group"> ' +
            '<label class="col-md-2 control-label" for="uri">URI</label> ' +
            '<div class="col-md-10"> ' +
            '<input id="uri" name="uri" type="text" placeholder="" class="form-control input-md" value="' + escapeHtml(song.uri) + '"> ' +
            '<span class="help-block">' + mf('song.edit.uri.help', 'Uusi URI tai hash biisille') + '</span> </div> ' +
            '</div> ' +
            '</div> </div>' +
            '</form></div>',
            buttons: {
                success: {
                    label: "OK",
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
                            sAlert.error( mf('validation.song.edit.invalid', 'Sori biisin tiedot eivät ole valideja.'));
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
    'click .rating-menu a': function(event, template) {

        var ratingData = {
            rating: (parseInt($(event.target).data('rating'))),
            songId: template.data._id,
            competitionId: template.data.competitionId
        }

        Meteor.call('insertOrUpdateRating', ratingData, function(error, result) {
            // display the error to the user and abort
            if (error) {
                throwError(error.reason);
            }
            else {
                $('.song-grid').isotope('updateSortData');
            }

        });

    },
    'click .see-all-song-results': function(e, template) {
        $(e.target).parents('.flip-container').toggleClass('flip');
    }
});

function calculateRating(songRatings) {
    var totalRating = 0;
    if(songRatings.length == 0) return totalRating;
    for (key in songRatings) {
        var rating = songRatings[key];
        totalRating = totalRating + rating.rating;
    }

    return (totalRating / songRatings.length).toFixed(2);;
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
    ratingChecked : function(value, parentContext) {
        var myRating = Ratings.findOne({songId:parentContext._id, userId:Meteor.userId()});
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
            countArr.push({ind:i, val:i + 1});
        }
        return countArr;
    },
    averageRating: function(song) {
        var songRatings = Ratings.find({songId:this._id}).fetch();
        return calculateRating(songRatings);
    },
    editSongDialog : editDialog
});