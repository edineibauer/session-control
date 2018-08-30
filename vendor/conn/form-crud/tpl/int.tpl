<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <input type="number" data-model="{$ngmodel}" id="{$ngmodel}" autocomplete="nope" data-format="int"
            {($value != "") ? "value='{$value}' " : "" }
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''} />
</div>
