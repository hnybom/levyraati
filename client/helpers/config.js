/**
 * Created by henriny on 13/02/15.
 */
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Meteor.startup(function () {

    sAlert.config({
        effect: 'genie',
        position: 'top-right',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 100, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
    });

    accountsUIBootstrap3.map("fi", {
        resetPasswordDialog: {
            title: "Palauta salasanasi",
            newPassword: "Uusi salasana",
            newPasswordAgain: "Uusi salasana uudestaan",
            cancel: "Sulje",
            submit: "Palauta salasana"
        },
        enrollAccountDialog: {
            title: "Valitse salasana",
            newPassword: "Uusi salasana",
            newPasswordAgain: "Uusi salasana uudestaan",
            cancel: "Sulje",
            submit: "Aseta salasana"
        },
        justVerifiedEmailDialog: {
            verified: "Sähköpostosoite varmistettu",
            dismiss: "Ok"
        },
        loginButtonsMessagesDialog: {
            dismiss: "Ok",
        },
        loginButtonsLoggedInDropdownActions: {
            password: "Vaihda salasana",
            signOut: "Kirjaudu ulos"
        },
        loginButtonsLoggedOutDropdown: {
            signIn: "Kirjaudu sisään",
            up: "Liity"
        },
        loginButtonsLoggedOutPasswordServiceSeparator: {
            or: "tai"
        },
        loginButtonsLoggedOutPasswordService: {
            create: "Luo",
            signIn: "Kirjaudu sisään",
            forgot: "Unohditko salasanasi?",
            createAcc: "Luo tili"
        },
        forgotPasswordForm: {
            email: "Sähköpostiosoite",
            reset: "Palauta salasana",
            invalidEmail: "Virheellinen sähköpostiosoite"
        },
        loginButtonsBackToLoginLink: {
            back: "Peru"
        },
        loginButtonsChangePassword: {
            submit: "Vaihda salasana",
            cancel: "Peru"
        },
        loginButtonsLoggedOutSingleLoginButton: {
            signInWith: "Kirjaudu sisään tunnuksilla",
            configure: "Kirjaudu sisään",
        },
        loginButtonsLoggedInSingleLogoutButton: {
            signOut: "Kirjaudu ulos"
        },
        loginButtonsLoggedOut: {
            noLoginServices: "Ei kirjautumispalvelua konfiguroituna"
        },
        loginFields: {
            usernameOrEmail: "Käyttäjätunnus tai sähköposti",
            username: "käyttäjätunnus",
            email: "Sähköposti",
            password: "Salasana"
        },
        signupFields: {
            username: "käyttäjätunnus",
            email: "Sähköposti",
            emailOpt: "Sähköposti (ei pakollinen)",
            password: "Salasana",
            passwordAgain: "Salasana (uudelleen)"
        },
        changePasswordFields: {
            currentPassword: "Nykyinen salasana",
            newPassword: "Uusi salasana",
            newPasswordAgain: "Uusi salasana (uudelleen)"
        },
        infoMessages : {
            emailSent: "Sähköposti lähettety",
            passwordChanged: "Salasana vaihdettu"
        },
        errorMessages: {
            genericTitle: "Tapahtui virhe",
            userNotFound: "Käyttäjää ei löydy",
            invalidEmail: "Virheellinen sähköpostiosoite",
            incorrectPassword: "Väärä salasana",
            usernameTooShort: "Käyttäjätunnuksen pitää olla vähintään 3 merkkiä pitkä",
            passwordTooShort: "Salasanan pitää olla vähintään 6 merkkiä pitkä",
            passwordsDontMatch: "Salasanat eivät täsmää",
            newPasswordSameAsOld: "Uuden ja vanhan salasanan tulee olla eriävät",
            signupsForbidden: "Rekisteröinti kielletty"
        }
    });

    accountsUIBootstrap3.setLanguage('fi');
    mfPkg.setLocale('fi');

});