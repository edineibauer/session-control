<?php
require('../../../../../../_config/config.php');

var_dump($_SESSION);

if (isset($_SESSION['userlogin']['token'])) {
    $token = new \ConnCrud\TableCrud("user_token");
    $token->load($_SESSION['userlogin']['token']);
    if ($token->exist()) {
        $token->token = "";
        $token->expire = "";
        $token->save();
    }

    setcookie("token", 0, time() - 1, "/");
    unset($_SESSION['userlogin']);
}
