<div class="{$form['class']}" style="{$form['style']}">
<label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
<input type="range" data-model="{$ngmodel}" id="{$ngmodel}" data-format="range"
        {($value !== false && $value === 1) ? "value='{$value}' " : "" }
        {($size !== false)? "maxlength='{$size}' " : ''}
        {($disabled)? "disabled='disabled' " : ''}
        {($default === false)? 'required="required" ' : ''} />
</div>
