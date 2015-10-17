Template.header.events({
    'click #to-finnish': function (e) {
        mfPkg.setLocale('fi');
        accountsUIBootstrap3.setLanguage('fi');
    },
    'click #to-english': function (e) {
        mfPkg.setLocale('en');
        accountsUIBootstrap3.setLanguage('en');
    }
});