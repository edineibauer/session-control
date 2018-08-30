<?php
/* Smarty version 3.1.32, created on 2018-04-26 13:18:06
  from 'C:\wamp64\www\session-control\vendor\conn\link-control\tpl\header.tpl' */

/* @var Smarty_Internal_Template $_smarty_tpl */
if ($_smarty_tpl->_decodeProperties($_smarty_tpl, array (
  'version' => '3.1.32',
  'unifunc' => 'content_5ae1fbbe240a02_88960463',
  'has_nocache_code' => false,
  'file_dependency' => 
  array (
    '0e29ea14dbd4c6d1e21afd7b7456786c82b83a20' => 
    array (
      0 => 'C:\\wamp64\\www\\session-control\\vendor\\conn\\link-control\\tpl\\header.tpl',
      1 => 1524759009,
      2 => 'file',
    ),
  ),
  'includes' => 
  array (
  ),
),false)) {
function content_5ae1fbbe240a02_88960463 (Smarty_Internal_Template $_smarty_tpl) {
?><!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title><?php echo $_smarty_tpl->tpl_vars['title']->value;?>
</title>

    <link rel="canonical" href="<?php echo $_smarty_tpl->tpl_vars['home']->value;?>
">
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width">
    <link rel="shortcut icon" href="<?php echo $_smarty_tpl->tpl_vars['favicon']->value;?>
">

    <?php echo $_smarty_tpl->tpl_vars['meta']->value;?>

    <?php echo $_smarty_tpl->tpl_vars['css']->value;?>

    <?php echo $_smarty_tpl->tpl_vars['font']->value;?>

    <?php echo '<script'; ?>
>const HOME = '<?php echo $_smarty_tpl->tpl_vars['home']->value;?>
';const ISDEV = false;const VERSION = <?php echo $_smarty_tpl->tpl_vars['version']->value;?>
;<?php echo '</script'; ?>
>
    <?php echo $_smarty_tpl->tpl_vars['js']->value;?>


</head>
<body><?php }
}
