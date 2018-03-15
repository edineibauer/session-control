<?php
use \ConnCrud\TableCrud;
use Helpers\Check;

$senha = strip_tags(trim(filter_input(INPUT_POST, 'senha', FILTER_DEFAULT)));
$restoreCode = filter_input(INPUT_POST, 'code', FILTER_DEFAULT);

$banco = new TableCrud("login");
$banco->load("token_recovery", $restoreCode);
if ($banco->exist()) {
    $banco->token_recovery = "";
    $banco->token = "";
    $banco->token_expira = "";
    $banco->password = Check::password($senha);
    $banco->save();

    $data['data'] = "1";
}