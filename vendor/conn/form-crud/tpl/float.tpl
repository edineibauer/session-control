<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
<input type="number" step="0.01" data-model="{$ngmodel}" id="{$ngmodel}" autocomplete="nope" data-format="float"
        {($value != "") ? "value='{$value}' " : "" }
        {($size !== false)? "maxlength='{$size}' " : ''}
        {($disabled)? "disabled='disabled' " : ''}
        {($default === false)? 'required="required" ' : ''} />
</div>