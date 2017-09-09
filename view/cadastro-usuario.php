<div class='container row pd-content60'>

    <div class='container center font-size13 grey-text upper'>Cadastro de novo Usuário</div>

    <div class="card col l8 m10 s12 push-m1 push-l2 center-align pd-content30">
        <div class="col s10 push-s1">
            <?php
            $form = new \FormCrud\Form("user");
            $form->showForm("materialize");
            ?>
        </div>
    </div>

    <div class="row clearfix"></div>

    <div class="container col l6 m10 s12 push-m1 push-l3 al-right">
        <a href="<?= defined('HOME') ? HOME : "" ?>login" class="grey-text upper">ir para
            tela de login</a>
    </div>
</div>
