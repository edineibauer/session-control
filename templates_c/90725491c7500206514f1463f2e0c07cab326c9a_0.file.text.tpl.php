<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\text.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf07a2d2_13050001',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '90725491c7500206514f1463f2e0c07cab326c9a' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\text.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf07a2d2_13050001 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="<?php echo $_smarty_tpl->tpl_vars['form']->value['class'];?>
" style="<?php echo $_smarty_tpl->tpl_vars['form']->value['style'];?>
">
    <label for="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['nome']->value;?>
 <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? "*" : '';?>
</label>
    <input type="text" data-model="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" id="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-format="text" autocomplete="off"
            <?php echo $_smarty_tpl->tpl_vars['value']->value != '' ? "value='".((string)$_smarty_tpl->tpl_vars['value']->value)."'" : '';?>

            <?php echo $_smarty_tpl->tpl_vars['size']->value !== false ? "maxlength='".((string)$_smarty_tpl->tpl_vars['size']->value)."' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['disabled']->value ? "disabled='disabled' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? 'required="required" ' : '';?>
 />
</div>
<?php }
}
