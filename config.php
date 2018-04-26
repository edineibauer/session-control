<?php
new LinkControl\EntityImport("session-control");

$email = (!defined('EMAIL') ? "contato@ontab.com.br" : EMAIL);
$read = new \ConnCrud\Read();
$read->exeRead(PRE . "usuarios", "ORDER BY id ASC LIMIT 1");
if (!$read->getResult())
    $id = \Entity\Entity::add("usuarios", ["nome" => "Admin", "nome_usuario" => "admin", "setor" => 1, "email" => $email, "password" => "mudar"]);
else
    $id = $read->getResult()[0]['id'];
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
                <p class="padding-medium font-light">Atualize as informações de Administrador! Atualmente senha é: "<b>mudar</b>"
                </p>
            </div>

            <?php
            $form = new \FormCrud\Form("usuarios");
            $form->showForm($id, ["nome", "nome_usuario", "email", "imagem", "password"]);
            ?>

            <button class="waves-effect waves-light btn-large" id="btn-login" disabled="disabled">
                <i class="material-icons left padding-right">save</i><span class="left">Atualizar e fazer Login</span>
            </button>
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
            post('config', 'configFinish', {local: "session-control"}, function (g) {
                if(g) {
                    toast("Entrando na Dashboard...", 1600);
                    setTimeout(function () {
                        window.location = HOME + "dashboard";
                    },1700);
                }
            });
        });
    }
</script>