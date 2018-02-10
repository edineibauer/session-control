var loginFree = true;
var logoutFree = true;

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

function logout() {
    if (logoutFree) {
        logoutFree = false;

        $.post(HOME + 'request/post', {lib: 'session-control', file: 'logout'}, function (g) {
            g = JSON.parse(g);
            if (g['status'] === "1") {
                Materialize.toast(g['mensagem'], 2000);
                setTimeout(function () {
                    window.location.href = HOME;
                }, 2000);

            } else if (g['status'] === "2") {
                Materialize.toast(g['mensagem'], 3000);
            } else {
                Materialize.toast("Erro Desconhecido", 3000);
                console.log(g);
            }
            logoutFree = true;
        });
    }
}