<div class="{$col}">
    <div class="input-field col s12">
        <select class="{$class} validate formcrud-input" required="{!$null}" id="{$column}" data-model="{$column}">
            {section name=index loop=$allow}
            <option value="{$allow[index]}">{$allowRelation[$smarty.section.index.index]}</option>
            {/section}
        </select>
        <label for="{$column}">{$title}</label>
    </div>
</div>