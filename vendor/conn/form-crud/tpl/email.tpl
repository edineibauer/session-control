<div class="{$form['class']} input-field col s12" style="{$form['style']}">
    <label class='font-light' for="{$ngmodel}"> Email {($default === false) ? "*" : ""}</label>
    <input type='email' id="{$ngmodel}" data-model="{$ngmodel}" data-format="email" autocomplete="nope"
            {($value != "") ? "value='{$value}' " : "" }
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''} />
</div>
