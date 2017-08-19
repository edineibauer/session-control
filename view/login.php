<?php
if (VISITANTE) {
    $log = new \SessionControl\Login();
    ?>
    <div class='container row pd-content60'>
        <div class='container al-center font-size13 grey-text upper'>área restrita</div>
        <div class="card container col l6 m10 s12 push-m1 push-l3 center-align pd-content30">
            <div class="row">
                <div class="input-field container">
                    <input id="emaillog" onkeyup="triggerButton('loginbtn', event)" type="email" class="validate">
                    <label for="emaillog">Email</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field container">
                    <input id="passlog" onkeyup="triggerButton('loginbtn', event)" type="password" class="validate">
                    <label for="passlog">Senha</label>
                </div>
            </div>

            <?php if (defined("RECAPTCHASITE") && $log->checkAttemptsExceded()) { ?>
                <div class="container">
                    <div class="g-recaptcha" data-sitekey="<?= RECAPTCHASITE ?>"></div>
                    <br>
                </div>
                <script type="text/javascript" src="https://www.google.com/recaptcha/api.js"></script>
            <?php } else { ?>
            <input type="hidden" id="g-recaptcha-response"/>
            <?php } ?>

            <div class="container pd-medium al-center" style="float:initial">
                <a href="<?= defined('HOME') ? HOME : "" ?>cadastro-usuario"
                   class="waves-effect waves-teal btn-flat color-gray">Cadastre-se</a>
                <button id="loginbtn" class="waves-effect waves-light btn" onclick="login();">
                    Entrar
                </button>
            </div>
        </div>

        <div class="row clearfix"></div>

        <div class="container col l6 m10 s12 push-m1 push-l3 al-right">
            <a href="<?= defined('HOME') ? HOME : "" ?>esqueci-a-senha"
               class="upper font-size09 teal-text">esqueci a senha</a>
        </div>
    </div>

    <?php
} else {
    header("Location: " . $_SESSION['userdata']['urlAdm']);
}