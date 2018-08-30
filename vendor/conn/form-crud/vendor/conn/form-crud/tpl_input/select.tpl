<div class="col s12">
    <label class="row" for="{$column}">{$title}</label>
    <select class="{$class} validate" required="{!$null}" id="{$column}" data-model="{$column}">
        {section name=index loop=$allow}
            <option value="{$allow[index]}" {($value && $value == $allow[index]) ? "selected='selected'" : ""}>{$allowRelation[$smarty.section.index.index]}</option>
        {/section}
    </select>
</div>
