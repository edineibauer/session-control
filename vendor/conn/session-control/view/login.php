<?php
if (LOGGED)
    header("Location: " . HOME . "dashboard");
?>
<div class='row font-large' style="max-width: 450px; margin: auto">
    <div class="clear"><br><br><br></div>
    <div class='container align-center upper panel color-text-grey'>área restrita</div>
    <div class="row z-depth-2 color-white" id="login-card">
        <div class="panel">
            <div class="panel">
                <label class="row">
                    <span>Email</span>
                    <input id="emaillog" type="email" class="font-light font-large">
                </label>
                <label class="row">
                    <span>Senha</span>
                    <input id="passlog" type="password" class="font-light font-large">
                </label>

                <?php if (defined("RECAPTCHASITE")) { ?>
                    <div class="container">
                        <div class="g-recaptcha" data-sitekey="<?= RECAPTCHASITE ?>"></div>
                        <br>
                    </div>
                    <script type="text/javascript" src="https://www.google.com/recaptcha/api.js"></script>

                <?php } else { ?>

                <input type="hidden" id="g-recaptcha-response"/>
                <?php } ?>
            </div>
        </div>
    </div>
    <div class="row clearfix" style="padding: 2px"></div>

    <div class="row card">
        <button id="loginbtn" class="col upper btn-large color-blue hover-opacity-off opacity" onclick="login();">
            Entrar
        </button>
    </div>

    <div class="row clearfix"><br></div>

    <div class="row upper color-text-grey font-small">
        <a href="<?= defined('HOME') ? HOME : "" ?>cadastro-usuario"
           class="left btn color-white color-text-grey hover-opacity-off opacity" style="text-decoration: none">
            Cadastre-se
        </a>
        <a href="<?= defined('HOME') ? HOME : "" ?>esqueci-a-senha"
           class="right btn color-white color-text-grey hover-opacity-off opacity"
           style="text-decoration: none; margin-right:0">
            esqueci a senha
        </a>
    </div>
</div>