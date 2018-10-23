var recoveryFree = true;

function recoveryEmail() {
    if (recoveryFree) {
        recoveryFree = false;
        let email = $("#recovery-email").val();
        if(email.length > 6 && email.test(/\w+@\w+.\w+/i)) {
            post('session-control', 'recoveryEmail', {email: email}, function (g) {
                if (!g) {
                    toast('Email não encontrado!', 4000, "toast-warning");
                } else {
                    toast('Link de Recuperação enviada ao email', 4000, "toast-success");
                    $("#recovery-email").val("");
                }

                recoveryFree = true;
            });
        } else {
            toast("Informe um email válido")
        }
    }
}