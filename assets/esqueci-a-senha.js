var recoveryFree = true;

function recoveryEmail() {
    if (recoveryFree) {
        recoveryFree = false;
        let email = $("#recovery-email").val();
        if(email.length > 6 && email.test(/\w+@\w+.\w+/i)) {
            post('session-control', 'recoveryEmail', {email: email}, function (g) {
                if (!g) {
                    $("body").panel(themeNotify('Email não encontrado!', "warning", 4000));
                } else {
                    $("body").panel(themeNotify('Link de Recuperação enviada ao email', 4000));
                    $("#recovery-email").val("");
                }

                recoveryFree = true;
            });
        } else {
            toast("Informe um email válido")
        }
    }
}