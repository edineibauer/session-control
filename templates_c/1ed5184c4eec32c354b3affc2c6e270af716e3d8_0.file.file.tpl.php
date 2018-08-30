<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\file.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf2adb47_53287466',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '1ed5184c4eec32c354b3affc2c6e270af716e3d8' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\file.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf2adb47_53287466 (Smarty_Internal_Template $_smarty_tpl) {
?><div class="<?php echo $_smarty_tpl->tpl_vars['form']->value['class'];?>
 form-file" style="<?php echo $_smarty_tpl->tpl_vars['form']->value['style'];?>
">
    <label for="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
"><?php echo $_smarty_tpl->tpl_vars['nome']->value;?>
 <?php echo $_smarty_tpl->tpl_vars['default']->value === false ? "*" : '';?>
</label>
    <?php if (isset($_smarty_tpl->tpl_vars['allow']->value['values'])) {?>
        <form action="<?php echo $_smarty_tpl->tpl_vars['home']->value;?>
request/post" enctype="multipart/form-data" id="form-<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
-<?php echo $_smarty_tpl->tpl_vars['column']->value;?>
"
              class="dropzone card">
            <div class="fallback">
                <input name="file" class="hide" type="file" multiple
                       accept="<?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['allow']->value['values'], 'name', false, 'i');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['i']->value => $_smarty_tpl->tpl_vars['name']->value) {
if ($_smarty_tpl->tpl_vars['i']->value > 0) {?>,<?php }?>.<?php echo $_smarty_tpl->tpl_vars['name']->value;
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>"/>
            </div>
            <input type="hidden" name="lib" value="form-crud"/>
            <input type="hidden" name="file" value="save/source"/>
            <input type="hidden" name="entity" value="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
"/>
            <input type="hidden" name="column" value="<?php echo $_smarty_tpl->tpl_vars['column']->value;?>
"/>
        </form>
        <input type="hidden" data-model="<?php echo $_smarty_tpl->tpl_vars['ngmodel']->value;?>
" id="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
-<?php echo $_smarty_tpl->tpl_vars['column']->value;?>
" data-format="file"
                <?php ob_start();
echo json_encode($_smarty_tpl->tpl_vars['value']->value);
$_prefixVariable1=ob_get_clean();
echo $_smarty_tpl->tpl_vars['value']->value ? "value='".$_prefixVariable1."'" : '';?>

                <?php echo $_smarty_tpl->tpl_vars['size']->value !== false ? "maxlength='".((string)$_smarty_tpl->tpl_vars['size']->value)."' " : '';?>
 />
    <?php } else { ?>
        <h3>Arquivo não aceita Nenhum Valor</h3>
    <?php }?>
</div><?php }
}
