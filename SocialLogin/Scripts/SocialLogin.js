$(document).ready(function () {
    'use strict';
    var accessToken = $('#hdCLIENTID').val();
    
    //******* facebook api **************
    window.fbAsyncInit = function () {
        FB.init({
            appId: $('#hdFacebookAppId').val(), // App ID
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true,  // parse XFBML
            version: 'v2.7'
        });
    };

    function Login() {
        FB.login(function (response) {
            if (response.authResponse) {
                getFacebookUserInfo();
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: 'email,user_photos,publish_actions'
        });
    }

    function getFacebookUserInfo() {
        FB.api('/me?fields=email,name', function (response) {
            console.log(response.name);
            console.log(response.email);
            $.ajax({
                url: "/SocialLogin.ashx?name=" + response.name + "&email=" + response.email,
                type: "POST",
                data: { 'token': accessToken },
                success: function (data) {
                    $('#loginPopup').html('<span class="text-success"><i class="fa fa-spinner fa-spin"></i>Đang xử lý...</span>');
                    location.reload();
                },
                error: function (data) {
                    console.log(data);
                }
            })
        });
    }

    function Logout() {
        FB.logout(function () { document.location.reload(); });
    }

    // Load the SDK asynchronously
    (function (d) {
        var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement('script'); js.id = id; js.async = true;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        ref.parentNode.insertBefore(js, ref);

    }(document));

    $('.lbtSignInFacebook').click(function () {
        $('#ModalLogin').modal('hide');
        Login();
    })
    //******* end facebook api ***********

    //**********google oauth2******
    var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
    var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
    var SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    var CLIENTID = $('#hdCLIENTID').val();
    var REDIRECT = $('#hdREDIRECT').val();
    var LOGOUT = 'http://accounts.google.com/Logout';
    var TYPE = 'token';
    var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
    var acToken;
    var tokenType;
    var expiresIn;
    var user;
    var loggedIn = false;
    function login_google() {
        var win = window.open(_url, "windowname1", 'width=800, height=600');
        var pollTimer = window.setInterval(function () {
            try {
                if (win.document.URL.indexOf(REDIRECT) != -1) {
                    window.clearInterval(pollTimer);
                    var url = win.document.URL;
                    acToken = gup(url, 'access_token');
                    tokenType = gup(url, 'token_type');
                    expiresIn = gup(url, 'expires_in');
                    win.close();
                    validateToken(acToken);
                }
            }
            catch (e) {
                console.log(e);
            }
        }, 500);
    }
    function validateToken(token) {
        $.ajax(
            {
                url: VALIDURL + token,
                data: null,
                success: function (responseText) {
                    getGoogleUserInfo();
                    loggedIn = true;
                    $('#loginText').hide();
                    $('#logoutText').show();
                },
                dataType: "jsonp"
            });
    }
    function getGoogleUserInfo() {
        $.ajax({
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
            data: null,
            success: function (response) {
                $.ajax({
                    url: "/SocialLogin.ashx?name=" + response.name + "&email=" + response.email,
                    type: "POST",
                    data: { 'token': accessToken },
                    success: function (data) {
                        $('#loginPopup').html('<span class="text-success"><i class="fa fa-spinner fa-spin"></i>Đang xử lý...</span>');
                        location.reload();
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            },
            dataType: "jsonp"
        });
    }

    function gup(url, name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\#&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results == null)
            return "";
        else
            return results[1];
    };

    $('.lbtSignInGoogle').click(function () {
        $('#ModalLogin').modal('hide');
        login_google();
    });
});