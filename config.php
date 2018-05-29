<?php
ob_start();
include_once PATH_HOME . 'vendor/conn/dashboard/ajax/view/inc/version_control.php';
?>
<style>body {
        background: #eeeeee;
    }</style>
<div class="row">
    <div class="container">
        <div class="card"
             style="background: #FFF; padding:30px; border-radius: 5px; float:initial; margin:30px auto; max-width: 900px">
            <br>
            <h3 class="font-bold align-center upper">Administrador do Sistema</h3>
            <br>

            <div class="card color-grey-light color-grey align-center">
                <div class="font-medium padding-8 upper font-bold color-red">Atenção!</div>
                <p class="padding-medium font-light">usuário: "<b>admin</b>"</p>
                <p class="padding-medium font-light">senha: "<b>mudar</b>"</p>
                <br>
                <p class="padding-medium font-light">clique no botão abaixo para ir a tela de login e depois utilize as credenciais acima.</p>
                <br>
                <p class="padding-medium font-light">Não esqueça de atualizar seu perfil!</p>
            </div>

            <a href="<?=HOME?>dashboard" class="waves-effect waves-light color-teal btn-large">
                <i class="material-icons left padding-right">people</i><span class="left">Fazer Login</span>
            </a>
        </div>
    </div>
</div>
<br>
<br>
<br>
<br>
<br>
<br>

<script>
    window.onload = function () {
        $("input[data-model='dados.password']").on("change keyup", function () {
            if ($(this).val().length > 3)
                $("#btn-login").prop("disabled", false).addClass("color-green hover-shadow");
        });

        $("#btn-login").on("click", function () {
            post('config', 'inc/configFinish', {local: "session-control"}, function (g) {
                if (g) {
                    toast("Entrando na Dashboard...", 1600);
                    setTimeout(function () {
                        window.location = HOME + "dashboard";
                    }, 1700);
                }
            });
        });
    }
</script>
<?php
$data['data']['content'] = ob_get_contents();
ob_end_clean();