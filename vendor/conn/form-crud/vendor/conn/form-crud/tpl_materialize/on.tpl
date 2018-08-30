<div class="col s12 left">
    <div class="switch left">
        <label>
            {$allowRelation[0]}
            <input type="checkbox" {($value == 1 || $value) ? 'checked="checked" ': ''}class="formcrud-input {$class}" id="{$column}" data-model="{$column}">
            <span class="lever"></span>
            {$allowRelation[1]}
        </label>
    </div>
</div>
<div class="clearfix"></div>