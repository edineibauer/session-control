<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <input type="text" data-model="{$ngmodel}" id="{$ngmodel}" data-format="text" autocomplete="off"
            {($value != "")? "value='{$value}'" : ''}
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''} />
</div>
