/**
 * Created by hnybom on 5.3.2016.
 */

Template.loginPage.helpers({
    loopCount: function (count) {
        var countArr = [];
        for (var i = 0; i < count; i++) {
            countArr.push({ind: i, val: "grid" + (i + 1) + ".jpg"});
        }
        return countArr;
    }
});
