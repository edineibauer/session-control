<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\email.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf4aba80_41190657',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '183d7f67aac5a6bf9bd4341a098fecdf02e97b90' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\email.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf4aba80_41190657 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="<?php echo $_smarty_tpl->tpl_vars['form']->value['class'];?>
 input-field col s12" style="<?php echo $_smarty_tpl->tpl_vars['form']->value['style'];?>
">
    <label class='font-light' for="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
"> Email <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? "*" : '';?>
</label>
    <input type='email' id="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-model="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-format="email" autocomplete="nope"
            <?php echo $_smarty_tpl->tpl_vars['value']->value != '' ? "value='".((string)$_smarty_tpl->tpl_vars['value']->value)."' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['size']->value !== false ? "maxlength='".((string)$_smarty_tpl->tpl_vars['size']->value)."' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['disabled']->value ? "disabled='disabled' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? 'required="required" ' : '';?>
 />
</div>
<?php }
}
