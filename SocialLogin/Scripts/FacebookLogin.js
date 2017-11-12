$(document).ready(function () {
    'use strict';
    var accessToken = $('#hdCLIENTID').val();

    //******* facebook api **************
    window.fbAsyncInit = function () {
        FB.init({
            appId: '1974007189550279', // App ID
            status: true, // check login status
            cookie: true, // enable cookies to allow the server to access the session
            xfbml: true,  // parse XFBML
            version: 'v2.11'
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
            //$.ajax({
            //    url: "/SocialLogin.ashx?name=" + response.name + "&email=" + response.email,
            //    type: "POST",
            //    data: { 'token': accessToken },
            //    success: function (data) {
            //        $('#loginPopup').html('<span class="text-success"><i class="fa fa-spinner fa-spin"></i>Đang xử lý...</span>');
            //        location.reload();
            //    },
            //    error: function (data) {
            //        console.log(data);
            //    }
            //})
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
        Login();
    })
});