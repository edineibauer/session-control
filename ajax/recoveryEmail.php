<?php
use \ConnCrud\TableCrud;

$email = trim(filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL));

if ($email) {
    $user = new TableCrud(PRE . "login");
    $user->load("email", $email);
    if ($user->exist()) {
        $code = md5(base64_encode(date('Y-m-d H:i:s') . "recovery-pass"));
        $user->setDados(['token' => null, 'token_recovery' => $code, "token_expira" => date('Y-m-d H:i:s')]);
        $user->save();

        $send = new \EmailControl\Email();
        $send->setAssunto("Recuperação de Senha " . SITENAME);
        $send->setTemplate("password", array("restore_code" => $code));
        $send->enviar($email);

        $data['data'] = true;
    }
}