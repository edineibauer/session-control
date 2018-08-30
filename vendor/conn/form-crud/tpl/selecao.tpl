<div class="{$form['class']}" style="{$form['style']}">
    <div class="row padding-medium color-text-grey font-small">{$nome} {($default === false) ? "*" : ""}</div>
    <div class="row">
        <div class="hide">
            <input type="hidden" data-model="{$ngmodel}" id="{$ngmodel}" data-format="list"
                    {($id !== "")? "value='{$id}'" : ''} />
        </div>
        <div class="col s12 container relative">
            <input type="text" placeholder="{$nome}" autocomplete="off" id="{$column}"
                    {($title != "")? "value='{$title}'" : ''}
                    {($size !== false)? "maxlength='{$size}' " : ''}
                    {($disabled)? "disabled='disabled' " : ''}
                    {($default === false)? 'required="required" ' : ''}
                   data-entity="{$relation}" data-parent="{$entity}"
                   class="form-list rest"/>
            <div class="col s12 list-complete" rel="one"></div>
        </div>
        <div class="multFieldsSelect" id="multFieldsSelect-{$relation}-{$column}">{$mult}</div>
    </div>
</div>