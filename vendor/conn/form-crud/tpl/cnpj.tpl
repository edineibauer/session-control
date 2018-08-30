<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <input type="text" data-model="{$ngmodel}" id="{$ngmodel}" autocomplete="off" data-format="cnpj"
            {($value != "") ? "value='{$value}' " : "" }
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($disabled)? "disabled='disabled' " : ''}
            {($default === false)? 'required="required" ' : ''}
           class="cnpj"/>
</div>