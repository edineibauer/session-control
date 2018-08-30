<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <select data-model="{$ngmodel}" id="{$ngmodel}" data-format="select"
            {($default === false)? 'required="required" ' : ''}
            {($disabled)? "disabled='disabled' " : ''}>
        <option value="0" {(!$value || ($value && $value !== "")) ? "selected='selected' " : ""}disabled="disabled">
            selecione
        </option>
        {foreach key=key item=item from=$allow['values']}
            <option {($value && $value === $item) ? "selected='selected' " : ""}value="{$item}">{$allow['names'][$key]}</option>
        {/foreach}
    </select>
</div>
