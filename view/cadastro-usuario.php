<div class='row font-size12' style="max-width: 750px; margin: auto">
    <div class="clear"><br></div>
    <div class='container center upper panel font-light color-text-grey'>Cadastro de Usuário</div><br>
    <div class="row z-depth-2 color-white">
        <div class="panel">
            <div class="panel">
                <?php
                $form = new \FormCrud\Form("login");
                $form->showForm();
                ?>
                <div class="center">
                <a href="<?= defined('HOME') ? HOME : "" ?>cadastro-usuario"
                   class="left btn-large color-green hover-shadow opacity" style="text-decoration: none; float:initial!important;">
                    cadastrar outro
                </a>
                </div>
            </div>
        </div>
    </div>

    <div class="row clear"><br></div>
    <div class="row upper color-text-grey font-size09">
        <a href="<?= defined('HOME') ? HOME : "" ?>login"
           class="left btn color-white color-text-grey hover-opacity-off opacity" style="text-decoration: none">
            fazer login
        </a>
    </div>
    <div class="row clear"><br><br><br><br></div>
</div>
