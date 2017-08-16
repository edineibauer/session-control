<?php
require('../../../../../../_config/config.php');

use \ConnCrud\TableCrud;

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

if ($email) {
    $user = new TableCrud("user");
    $user->load("email", $email);
    if ($user->exist()) {
        $code = md5(base64_encode(date('Y-m-d H:i:s') . "recovery-pass"));
        $user->code = $code;
        $user->save();

        $send = new \EmailControl\Email();
        $send->setAssunto("Recuperação de Senha " . SITENAME);
        $send->setTemplate("password", array("code" => $code));
        $send->enviar($email);

        echo '1';

    } else {
        echo '2';
    }
}