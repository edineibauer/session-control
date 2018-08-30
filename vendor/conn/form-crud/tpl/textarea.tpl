<div class="{$form['class']}" style="{$form['style']}">
    <label for="{$ngmodel}">{$nome} {($default === false) ? "*" : ""}</label>
    <textarea data-model="{$ngmodel}" id="{$ngmodel}" data-format="textarea"
            {($size !== false)? "maxlength='{$size}' " : ''}
            {($default === false)? 'required="required" ' : ''}
            {($disabled)? "disabled='disabled' " : ''}
              style="height: 142px;" class="flow-text padding-small"
              placeholder="descrição..." rows="10">{$value}</textarea>
</div>