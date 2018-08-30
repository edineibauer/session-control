<div class="col">{$title}</div>
<div class="col s12 section {$class}">
    {if $value}
        {foreach from=$value item=text}
            <div class='col chip z-depth-2'>
                <div class='chip-text'>{$text}</div>
                <i class='material-icons pointer removeChip'>clear</i>
            </div>
        {/foreach}
    {/if}
    <div class="rest" style="position: relative">
        <input type="text" id="{$column}" data-model="{$column}" data-entity="{$table}"
              placeholder=" + {$title}" maxlength="127" class="{$class} autocomplete-mult" required="{!$null}">
    </div>
</div>
