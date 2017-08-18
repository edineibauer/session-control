<?php
use \ConnCrud\TableCrud;

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

if ($email) {
    $user = new TableCrud("user_token");
    $user->load("email", $email);
    if ($user->exist()) {
        $code = md5(base64_encode(date('Y-m-d H:i:s') . "recovery-pass"));
        $user->restore_code = $code;
        $user->save();

        $send = new \EmailControl\Email();
        $send->setAssunto("Recuperação de Senha " . SITENAME);
        $send->setTemplate("password", array("restore_code" => $code));
        $send->enviar($email);

        echo '1';

    } else {
        echo '2';
    }
}