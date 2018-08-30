<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:20:14
  from 'C:\wamp64\www\session-control\vendor\conn\table\tpl\table.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fc3e9fd082_87205879',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '9652914477847badc6809ff999ab81fa344edb4e' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\table\\tpl\\table.tpl',
      1 => 1524759193,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fc3e9fd082_87205879 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="responsive tableList" id="tableList-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
" data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
">
    <div class="row panel">

        <div class="font-xlarge left"><?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
</div>

        <span class="padding-medium color-text-grey left">
            <b id="table-total-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['total']->value;?>
</b> registros</span>

        <button class="btb right color-teal hover-shadow opacity hover-opacity-off" id="btn-table-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
" onclick="tableNovo('<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
')">
            <i class="material-icons left">add</i><span class="left">Novo</span>
        </button>

        <label class="right">
            <input type="text" class="table-search" autocomplete="nope" id="search-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
" data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"
                   placeholder="busca..." style="margin-bottom: 0;font-size:14px"/>
        </label>

        <select class="right tableLimit" id="limit-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
" data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"
                style="width: auto;margin-bottom: 0;margin-top: -5.5px;">
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="250">250</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
        </select>

        <span class="padding-medium color-text-grey right table-cont-pag" id="table-cont-pag-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"></span>

    </div>
    <table class="table-all" id="table-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
">
        <tr>
            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['header']->value, 'item', false, 'i');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['i']->value => $_smarty_tpl->tpl_vars['item']->value) {
?>
                <th><?php if ($_smarty_tpl->tpl_vars['i']->value === 0) {?>
                        <label class="left">
                            <input type="checkbox" class="table-select-all" data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"
                                   style="margin: 15px 2rem 11px 0px;"/>
                        </label>
                    <?php }?>
                    <span><?php echo $_smarty_tpl->tpl_vars['item']->value;?>
</span>
                </th>
            <?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
            <th class="align-right" style="padding-right: 20px;">Ações</th>
        </tr>
    </table>

    <div class="row panel" id="pagination-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"></div>

    <input type="hidden" class="table-pagina" value="1" data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
" id="table-pagina-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"/>

    <?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['home']->value;?>
vendor/conn/table/assets/table.min.js" defer><?php echo '</script'; ?>
>
    <?php echo '<script'; ?>
 src="<?php echo $_smarty_tpl->tpl_vars['home']->value;?>
vendor/conn/table/assets/pagination.min.js" defer><?php echo '</script'; ?>
>
</div><?php }
}
