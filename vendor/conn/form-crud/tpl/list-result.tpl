<ul class="col s12 card list-result-itens" style="margin-top: -15px">
    {foreach key=key item=v from=$data}
        <li rel="{$v['id']}" class="list-option col s12 container padding-medium hover-opacity-off pointer opacity{($key === 0) ? " active" : ""}">
            {$v[$column]}
        </li>
    {/foreach}
</ul>