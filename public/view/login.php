<?php
if (!empty($_SESSION['userlogin'])) {
    $data['response'] = 3;
    $data['data'] = HOME . "dashboard";
} else {
    ob_start();
    ?>

    <style>
        #core-header {
            box-shadow: none!important;
        }
    </style>

    <div class="col theme" style="padding: 0 10px 300px 10px;margin-top: -1px">
        <div class='row container font-large' style="max-width: 470px; margin: auto">
            <div class="clear"><br><br><br><br></div>
            <div class='container align-center upper panel color-text-white'>acesso restrito <?= SITENAME ?></div>
            <div class="row z-depth-2 color-white radius" id="login-card">
                <div class="panel">
                    <div class="panel" style="    padding: .01em 16px;">
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

            <div class="row padding-top">
                <button id="loginbtn" class="col card radius upper btn-large theme-d5 color-text-white hover-opacity-off opacity" onclick="login();">
                    acessar
                </button>
            </div>

            <div class="row upper color-text-grey font-small">
                <a href="<?= defined('HOME') ? HOME : "" ?>cadastro-usuario"
                   class="left radius btn color-white color-text-grey hover-opacity-off opacity" style="text-decoration: none">
                    Cadastre-se
                </a>
                <a href="<?= defined('HOME') ? HOME : "" ?>esqueci-a-senha"
                   class="right radius btn color-white color-text-grey hover-opacity-off opacity"
                   style="text-decoration: none; margin-right:0">
                    esqueci a senha
                </a>
            </div>
            <div class="clear"><br><br><br></div>
        </div>
    </div>
    <?php
    $data['data'] = ob_get_contents();
    ob_end_clean();
}