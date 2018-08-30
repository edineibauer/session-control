<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:07
  from 'C:\wamp64\www\session-control\vendor\conn\form-crud\tpl\form.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbf822e33_39420042',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '7980ac2d8fecc080d0da38f3ff639b8240ef138a' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\form-crud\\tpl\\form.tpl',
      1 => 1524759169,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbf822e33_39420042 (Smarty_Internal_Template $_smarty_tpl) {
echo $_smarty_tpl->tpl_vars['scripts']->value;?>

<div class='form-control row font-large'>
    <div class="row relative form-crud" id='form_<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
' data-entity="<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
">
        <div class="panel">
            <input type='hidden' rel='title' value='<?php echo $_smarty_tpl->tpl_vars['relevant']->value;?>
'>
            <?php
$_from = $_smarty_tpl->smarty->ext->_foreach->init($_smarty_tpl, $_smarty_tpl->tpl_vars['inputs']->value, 'input');
if ($_from !== null) {
foreach ($_from as $_smarty_tpl->tpl_vars['input']->value) {
?>
                <?php echo $_smarty_tpl->tpl_vars['input']->value;?>

            <?php
}
}
$_smarty_tpl->smarty->ext->_foreach->restore($_smarty_tpl, 1);?>
            <input type="hidden" value="<?php echo $_smarty_tpl->tpl_vars['autoSave']->value;?>
" id="autoSave"/>
            <input type="hidden" value="<?php echo $_smarty_tpl->tpl_vars['callback']->value;?>
" id="callbackAction"/>
            <?php if (!$_smarty_tpl->tpl_vars['autoSave']->value) {?>
                <div class="col padding-16">
                    <button class="btn color-teal hover-shadow opacity hover-opacity-off" id="saveFormButton"><i
                                class="material-icons left padding-right">save</i>Salvar
                    </button>
                </div>
            <?php }?>
        </div>
        <?php echo '<script'; ?>
>
            (function () {
                var $head = document.getElementsByTagName('head')[0];
                if (document.querySelector("script[data-info='form-crud']") === null) {
                    var style = document.createElement('link');
                    style.rel = "stylesheet";
                    style.href = HOME + 'vendor/conn/form-crud/assets/main.min.css?v=' + VERSION;
                    $head.appendChild(style);

                    var script = document.createElement('script');
                    script.setAttribute("data-info", "form-crud");
                    script.src = HOME + 'vendor/conn/form-crud/assets/main.min.js?v=' + VERSION;
                    $head.appendChild(script);
                } else {
                    loadForm('#form_<?php echo $_smarty_tpl->tpl_vars['entity']->value;?>
');
                }
            })();
        <?php echo '</script'; ?>
>
    </div>
</div>
<?php }
}
