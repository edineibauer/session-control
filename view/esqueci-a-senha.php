<div class='container row pd-content60'>
    <div class="card container col l6 m10 s12 push-m1 push-l3 center-align pd-content30">
        <div class="row">
            <div class="input-field container">
                <input id="recovery-email" onkeyup="triggerButton('send-email-recover', event)" type="email"
                       class="validate">
                <label for="emaillog">Digite seu Email</label>
            </div>
        </div>
        <div class="container pd-medium al-center" style="float:initial">
            <button class="waves-effect waves-light btn" id="send-email-recover" onclick="recoveryEmail();">
                Enviar Email de Recuperação
            </button>
        </div>
    </div>

    <div class="row clearfix"></div>

    <div class="container col l6 m10 s12 push-m1 push-l3 al-right">
        <a href="<?= defined('HOME') ? HOME : "" ?>login" class="grey-text upper">voltar para
            tela de login</a>
    </div>
</div>