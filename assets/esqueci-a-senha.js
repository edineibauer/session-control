var recoveryFree = true;

function recoveryEmail() {
    if (recoveryFree) {
        recoveryFree = false;
        post('session-control', 'recoveryEmail', {email: $("#recovery-email").val()}, function (g) {
            if (!g) {
                $("body").panel(themeNotify('Email não encontrado!', "warning", 4000));
            }else {
                $("body").panel(themeNotify('Link de Recuperação enviada ao email', 4000));
                $("#recovery-email").val("");
            }

            recoveryFree = true;
        });
    }
}