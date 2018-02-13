var loginFree = true;

function login() {
    if (loginFree) {
        $("#login-card").loading();
        loginFree = false;
        var email = $("#emaillog").val();
        var pass = $("#passlog").val();
        var recaptcha = $("#g-recaptcha-response").val();
        post('session-control', 'login', {
            email: email,
            pass: pass,
            recaptcha: recaptcha
        }, function (g) {
            if(g) {
                toast(g, "warning", 3000);
            } else {
                toast("Logando...", 2000);

                setTimeout(function () {
                    window.location.href = HOME + 'dashboard';
                }, 1500);
            }
            loginFree = true;
        });

    }
}