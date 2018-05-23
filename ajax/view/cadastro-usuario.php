<?php
ob_start();
?>
    <div class='row font-large' style="max-width: 750px; margin: auto">
        <div class="clear"><br></div>
        <div class='container align-center upper panel font-light color-text-grey'>Cadastro de Usuário</div>
        <br>
        <div class="row z-depth-2 color-white">
            <div class="panel">
                <div class="panel">
                    <?php
                    $form = new \FormCrud\Form("usuarios");
                    $form->setAutoSave(false);
                    $form->setCallback("goToDashboard");
                    $form->showForm(["nome", "email", "password"]);
                    ?>
                </div>
            </div>
        </div>

        <div class="row clear"><br></div>
        <div class="row upper color-text-grey font-small">
            <a href="<?= defined('HOME') ? HOME : "" ?>login"
               class="left btn color-white color-text-grey hover-opacity-off opacity" style="text-decoration: none">
                fazer login
            </a>
        </div>
        <div class="row clear"><br><br><br><br></div>
    </div>

<?php
$data['data']['title'] = "Cadastro de Novo Usuário";
$data['data']['content'] = ob_get_contents();
ob_end_clean();