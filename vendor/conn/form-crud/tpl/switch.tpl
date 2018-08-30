<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}" class="row">{$nome} {($default === false) ? "*" : ""}</label>
    <label class="switch">
        <input type="checkbox" data-model="{$ngmodel}" id="{$ngmodel}" data-format="switch"
                {($value !== false && $value === 1) ? "checked='checked' " : "" }
                {($size !== false)? "maxlength='{$size}' " : ''}
                {($disabled)? "disabled='disabled' " : ''}
                {($default === false)? 'required="required" ' : ''}
               class="switchCheck"/>
        <div class="slider"></div>
    </label>
</div>