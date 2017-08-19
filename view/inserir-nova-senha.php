<?php
$code = str_replace('inserir-nova-senha/', '', PATH_URL);
?>
<div class="card container col l6 m10 s12 push-m1 push-l3 center-align pd-content30">
    <div class="row">
        <div class="input-field container">
            <input id="nova-senha" autocomplete="off" onkeyup="triggerButton('send-new-senha', event)" type="password" class="validate">
            <label for="emaillog">Nova Senha</label>
        </div>
        <div class="input-field container">
            <input id="nova-senha-confirm" autocomplete="off" onkeyup="triggerButton('send-new-senha', event)" type="password" class="validate">
            <label for="emaillog">Confirme a Nova Senha</label>
        </div>
    </div>
    <input type="hidden" id="code" value="<?=$code?>" />
    <div class="container pd-medium al-center" style="float:initial">
        <button class="waves-effect waves-light btn" id="send-new-senha" onclick="newPassword();">
            Confirmar Nova Senha
        </button>
    </div>
</div>

<div class="row clearfix"></div>

<div class="container col l6 m10 s12 push-m1 push-l3 al-right">
    <a href="<?= defined('HOME') ? HOME : "" ?>login" class="grey-text upper">ir para
        tela de login</a>
</div>
