<div class="{$form['class']} row card" style="{$form['style']}">
    <div class="row padding-medium color-text-grey font-small">{$nome} {($default === false) ? "*" : ""}</div>
    <div class="row">
        <div class="col container right" style="width:92px">
            <div class="col btn-floating color-teal opacity hover-opacity-off listButton left" id="list-{$relation}" data-entity="{$relation}"
                     {($disabled)? "disabled='disabled' " : ''}
                 style="width:41px">
                <i class="material-icons prefix pointer editList">add</i>
            </div>
            <input type="hidden" data-model="{$ngmodel}" id="{$entity}-{$column}" data-format="list_mult"
                    {($value)? "value='[{foreach item=id key=i from=$value}{if $i > 0},{/if}{$id.id}{/foreach}]'" : ''} />
        </div>
        <div class="rest container relative">
            <input type="text" placeholder="{$nome}" autocomplete="nope" id="{$column}"
                    {($size !== false)? "maxlength='{$size}' " : ''}
                    {($default === false)? 'required="required" ' : ''}
                    {($disabled)? "disabled='disabled' " : ''}
                   data-entity="{$relation}" data-parent="{$entity}"
                   class="form-list rest"/>
            <div class="col s12 list-complete" rel="mult"></div>
        </div>

        <div class="container listmult-content">
            {if $value}
                {foreach item=data key=i from=$value}
                    <div class="listmult-card" style="border-top: solid 2px #EEE;margin-bottom: 2px!important;" rel="{$data.id}">
                        <div class="col padding-small container" style="width:60px">
                            <i class="material-icons padding-medium">{$icon}</i>
                        </div>
                        <div class="rest padding-small relative">
                            <div class="right" style="width: 100px; height: 45px">
                                <button id="{$entity}-{$column}-btn"
                                        onclick="editListMult('{$relation}', '#{$entity}-{$column}', {$data.id})"
                                        class="btn-floating color-white hover-shadow opacity hover-opacity-off"><i
                                            class="material-icons">edit</i></button>
                                <button onclick="removerListMult('#{$entity}-{$column}', {$data.id})"
                                        class="btn-floating color-white color-hover-text-red hover-shadow opacity hover-opacity-off"><i
                                            class="material-icons">delete</i></button>
                            </div>
                            <div class="left container padding-medium listmult-title">{$data.title}</div>
                        </div>
                    </div>
                {/foreach}
            {/if}
        </div>

        <div class="tpl_list_mult hide listmult-card" style="border-top: solid 2px #EEE;margin-bottom: 2px!important;" rel="__$0__">
            <div class="col padding-small container" style="width:60px">
                <i class="material-icons padding-medium">{$icon}</i>
            </div>
            <div class="rest padding-small relative">
                <div class="right" style="width: 100px; height: 45px">
                    <button id="{$entity}-{$column}-btn"
                            onclick="editListMult('{$relation}', '#{$entity}-{$column}', __$0__)"
                            class="btn-floating color-white hover-shadow opacity hover-opacity-off"><i
                                class="material-icons">edit</i></button>
                    <button onclick="removerListMult('#{$entity}-{$column}', __$0__)"
                            class="btn-floating color-white color-hover-text-red hover-shadow opacity hover-opacity-off"><i
                                class="material-icons">delete</i></button>
                </div>
                <div class="left container padding-medium listmult-title">__$1__</div>
            </div>
        </div>
    </div>
</div>