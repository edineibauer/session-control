<div class='container row pd-content60'>
    <div class="card container col l6 m10 s12 push-m1 push-l3 center-align pd-content30">
        <?php
        $form = new \FormCrud\Form("user");
        $form->showForm("materialize");
        ?>
    </div>

    <div class="row clearfix"></div>

    <div class="container col l6 m10 s12 push-m1 push-l3 al-right">
        <a href="<?= defined('HOME') ? HOME : "" ?>login" class="grey-text upper">ir para
            tela de login</a>
    </div>
</div>
