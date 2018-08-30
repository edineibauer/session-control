<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\hidden.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf744ce3_36837734',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'c4b2920ca21341bd124e30039b14f62ac6ebf700' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\hidden.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf744ce3_36837734 (Smarty_Internal_Template $_smarty_tpl) {
?><input type='hidden' <?php echo $_smarty_tpl->tpl_vars['value']->value && $_smarty_tpl->tpl_vars['value']->value > 0 ? "value='".((string)$_smarty_tpl->tpl_vars['value']->value)."' " : '';?>
 data-model="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" id="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-format="hidden" /><?php }
}
