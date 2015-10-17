/**
 * Created by hnybom on 16.10.2015.
 */
Meteor.startup(function () {
    mfPkg.init('fi');
    mfPkg.webUI.deny();
});