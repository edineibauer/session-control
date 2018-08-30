<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\password.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf6479e1_23312245',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    'ab7d1db4af64151fb97d878e7883d91415e9a427' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\password.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf6479e1_23312245 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="<?php echo $_smarty_tpl->tpl_vars['form']->value['class'];?>
" style="<?php echo $_smarty_tpl->tpl_vars['form']->value['style'];?>
">
    <label class='font-light' for="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
">Nova Senha <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? "*" : '';?>
</label>
    <input type='password' id="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-model="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" data-format="password"
            <?php echo $_smarty_tpl->tpl_vars['size']->value !== false ? "maxlength='".((string)$_smarty_tpl->tpl_vars['size']->value)."' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['disabled']->value ? "disabled='disabled' " : '';?>

            <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? 'required="required" ' : '';?>
 autocomplete="new-password" />
</div>
<?php }
}
