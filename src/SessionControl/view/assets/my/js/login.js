var recoveryFree = true;
var loginFree = true;

function recoveryEmail() {
    if (recoveryFree) {
        recoveryFree = false;
        $.post(HOME + '/src/SessionControl/request/recoveryEmail.php', {email: $("#recovery-email").val()}, function (g) {
            if (g === "1") {
                $("#recovery-email").val("");
                Materialize.toast('Link de Recuperação enviada ao email', 4000);
            } else if (g === "2") {
                Materialize.toast("Email não encontrado!", 4000);
            } else {
                Materialize.toast("Erro Desconhecido", 3000);
                console.log(g);
            }
            recoveryFree = true;
        });
    }
}

function login() {
    if (loginFree) {
        loginFree = false;

        $.post(HOME + '/src/SessionControl/request/login.php', {
            email: $("#emaillog").val(),
            pass: $("#passlog").val()
        }, function (g) {
            g = JSON.parse(g);
            console.log(g);
            if (g['status'] === "1") {
                window.location.href = HOME + '/login';
            } else if (g['status'] === "2") {
                Materialize.toast(g['mensagem'], 3000);
            } else {
                Materialize.toast("Erro Desconhecido", 3000);
                console.log(g);
            }
            loginFree = true;
        });
    }
}