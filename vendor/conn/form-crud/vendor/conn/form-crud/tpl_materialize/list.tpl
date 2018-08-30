<div class="{$col}">
    <div class="input-field col s12">
        <i class="material-icons prefix pointer">{($value === "") ? "add" : "edit"}</i>
        <input type="text" id="{$column}" value="{$value}" data-model="{$column}" data-entity="{$table}" class="{$class} autocomplete validate" required="{!$null}">
        <label for="{$column}">{$title}</label>
    </div>
</div>
<div class="clearfix"></div>