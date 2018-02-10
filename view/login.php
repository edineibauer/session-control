<?php
if (!defined("VISITANTE") && defined("PATH_HOME")) {

    $conf = "\n\n\$session = new \SessionControl\Session();
\$session->setLevelAccess(1, \"usuário\", \"user\",\"usuário do site, acesso a recursos e consumidor de produtos.\");
\$session->setLevelAccess(2, \"produtor\", \"producer\", \"produtor de conteúdos para o site, ou abastecimento de informações.\");
\$session->setLevelAccess(3, \"analista\", \"managment\", \"analista, verificador de conteúdo. Gerenciador dos usuários de produção e usuários do site\");
\$session->setLevelAccess(4, \"gerente\", \"adm\", \"acesso total ao sistema com excessão ao gerenciamento de usuários de mesmo nível ou superior.\");
\$session->setLevelAccess(5, \"administrador\", \"adm\", \"acesso total ao sistema e controle.\");\n\n";

    $fp = fopen(PATH_HOME . "_config/config.php", "a+");
    $escreve = fwrite($fp, $conf);
    fclose($fp);

    header("Location: login");
}
if (VISITANTE) {
    $log = new \SessionControl\Login();
    ?>
    <div class='row font-size13' style="max-width: 450px; margin: auto">
        <div class="clear"><br><br><br></div>
        <div class='container center upper panel color-text-grey'>área restrita</div>
        <div class="row z-depth-2 color-white" id="login-card">
            <div class="panel">
                <div class="panel">
                    <label class="row">
                        <span>Email</span>
                        <input id="emaillog" type="email" class="font-light font-size13">
                    </label>
                    <label class="row">
                        <span>Senha</span>
                        <input id="passlog" type="password" class="font-light font-size13">
                    </label>

                    <?php if (defined("RECAPTCHASITE") && $log->checkAttemptsExceded()) { ?>
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

        <div class="row upper color-text-grey font-size07">
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

    <?php
} else {
    header("Location: " . $_SESSION['userdata']['urlAdm']);
}