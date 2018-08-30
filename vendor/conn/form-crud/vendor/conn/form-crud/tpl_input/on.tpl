<div class="col s12 section {$class}">
    <label class="switch">
        {$allowRelation[0]} | {$allowRelation[1]}
        <input type="checkbox" {($value == 1 || $value) ? 'checked="checked" ': ''}class="formcrud-input" id="{$column}"
               data-model="{$column}">
        <div class="slider"></div>
    </label>
</div>