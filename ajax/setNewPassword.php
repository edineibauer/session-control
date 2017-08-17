<?php
require('../../../../../../_config/config.php');

use \ConnCrud\TableCrud;

$senha = strip_tags(trim(filter_input(INPUT_POST, 'senha', FILTER_DEFAULT)));
$restoreCode = filter_input(INPUT_POST, 'code', FILTER_DEFAULT);

function encrypt($senha)
{
    $senha = md5("Control" . trim($senha) . "Session");
    $key1 = array('1', 'c', 's', '2', 'r', 'o', 'n', 'l', 'f', 'x', '0', 'k', 'v', '5', 'y');
    $key2 = array('b', '4', '9', '6', 'w', 'a', 'd', '3', 'z', '7', 'j', 'm', '8', 'h', 't');
    return md5(str_replace($key1, $key2, $senha));
}

$banco = new TableCrud("user_token");
$banco->load("restore_code", $restoreCode);
if ($banco->exist()) {
    $banco->restore_code = "";
    $banco->token = "";
    $banco->expire = "";
    $banco->password = encrypt($senha);
    $banco->save();

    echo 1;

} else {
    echo 2;
}