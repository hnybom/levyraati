/**
 * Created by hnybom on 5.10.2015.
 */
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('hh:mm:ss / DD-MM-YYYY');
});

Template.registerHelper('formatDateWithoutTime', function(date) {
    return moment(date).format('DD.MM.YYYY');
});

Template.registerHelper('getUserName', function(userId) {
    var user = Meteor.users.findOne(userId);
    if (user) {
        if(user.profile && user.profile.name) return user.profile.name
        return user.username;
    }
    return "";
});

Template.registerHelper('isSpotify', isSpotifySong);

Template.registerHelper('isYoutube', isYoutubeHash);

Template.registerHelper('ifNotEmpty', function(item, options) {
    if(item){
        if(item instanceof Array){
            if(item.length > 0){
                return options.fn(this);
            }else{
                return options.inverse(this);
            }
        }else{
            if(item.fetch().length > 0){
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }else{
        return options.inverse(this);
    }
});
