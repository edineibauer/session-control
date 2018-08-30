<div class="col s12 section {$class}">
    <button class="btn-floating color-grey-light" style="width:41px">
        <i class="material-icons prefix pointer editList">{($value === "") ? "add" : "edit"}</i>
    </button>
    <div class="rest relative">
        <input type="text" id="{$column}" placeholder="{$title}" value="{$value}" data-model="{$column}" data-entity="{$table}" maxlength="127" class="{$class} autocomplete validate" required="{!$null}">
    </div>
</div>
