<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <input type="date" id="{$ngmodel}" data-model="{$ngmodel}" data-format="date"
            {($value != "") ? "value='{$value}' " : "" }
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''} />
</div>
