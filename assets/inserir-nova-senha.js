var novaSenha = true;

function newPassword() {
    if (novaSenha) {
        novaSenha = false;
        if ($("#nova-senha").val() === $("#nova-senha-confirm").val()) {
            $.post(HOME + 'request/post', {
                lib: 'session-control',
                file: 'setNewPassword',
                senha: $("#nova-senha").val(),
                code: $("#code").val()
            }, function (g) {
                if (g === "1") {
                    Materialize.toast('Senha Modificada, redirecionando...', 2000);
                    setTimeout(function () {
                        window.location.href = HOME + "login";
                    },2000);
                } else if (g === "2") {
                    Materialize.toast("Token de alteração Inválido! Favor, requisitar email de recuperação.", 6000);
                } else {
                    Materialize.toast("Erro Desconhecido", 3000);
                    console.log(g);
                }
                novaSenha = true;
            });
        } else {
            novaSenha = true;
        }
    }
}