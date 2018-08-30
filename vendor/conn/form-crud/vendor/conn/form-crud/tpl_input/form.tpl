<header class="color-blue container">
    <h2>{($id) ? "Editar " : "Cadastro de "}{$entity}</h2>
</header>
<form class="row relative" id='form_{$entity}' method='post' data-table="{$entity}" action="saveFormCrud">
    <div class="panel">
        {foreach $inputs as $input}
            {$input}
        {/foreach}
    </div>
</form>
<script src="{$home}vendor/conn/form-crud/assets/js/form.js" defer ></script>