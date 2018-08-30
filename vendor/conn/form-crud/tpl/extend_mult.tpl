<div class="{$form['class']} row card" style="{$form['style']}">
    <div class="col container padding-small right" style="width:160px">
        <button class="btn opacity hover-opacity-off color-teal listButton hover-shadow margin-small"
                {($disabled)? "disabled='disabled' " : ''} id="list-{$relation}" data-entity="{$relation}">
            <i class="material-icons left padding-right">add</i>
            <span class="left pd-small">Novo</span>
        </button>

        <input type="hidden" data-model="{$ngmodel}" id="{$entity}-{$column}" data-format="extend_mult"
                {($value)? "value='[{foreach item=id key=i from=$value}{if $i > 0},{/if}{$id.id}{/foreach}]'" : ''} />
    </div>
    <div class="rest container padding-xlarge relative">
        {$nome}
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
                            <button id="{$entity}-{$column}-btn" onclick="editListMult('{$relation}', '#{$entity}-{$column}', {$data.id})" class="btn-floating hover-shadow color-white opacity hover-opacity-off"><i class="material-icons">edit</i></button>
                            <button onclick="removerListMult('#{$entity}-{$column}', {$data.id})" class="btn-floating color-hover-text-red hover-shadow color-white opacity hover-opacity-off"><i class="material-icons">delete</i></button>
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
                <button id="{$entity}-{$column}-btn" onclick="editListMult('{$relation}', '#{$entity}-{$column}', __$0__)" class="btn-floating hover-shadow color-white opacity hover-opacity-off"><i class="material-icons">edit</i></button>
                <button onclick="removerListMult('#{$entity}-{$column}', __$0__)" class="btn-floating color-hover-text-red hover-shadow color-white opacity hover-opacity-off"><i class="material-icons">delete</i></button>
            </div>
            <div class="left container padding-medium listmult-title">__$1__</div>
        </div>
    </div>
</div>