<form class="row plugin" id='form_{$entity}' method='post' data-plugin="form" data-table="{$entity}" action="saveFormCrud">
    {foreach $inputs as $input}
        {$input}
    {/foreach}
</form>