<div class="{$form['class']}" style="{$form['style']}">
    <label class='font-light' for="{$ngmodel}">Nova Senha {($default === false) ? "*" : ""}</label>
    <input type='password' id="{$ngmodel}" data-model="{$ngmodel}" data-format="password"
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''} autocomplete="new-password" />
</div>
