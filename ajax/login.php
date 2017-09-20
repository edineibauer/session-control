<?php

use SessionControl\Login;
use Helpers\Helper;

$dados['email'] = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
$dados['password'] = filter_input(INPUT_POST, "pass", FILTER_DEFAULT);
$dados['recaptcha'] = filter_input(INPUT_POST, "recaptcha", FILTER_DEFAULT);

if ($dados['email'] && $dados['password']) {

    function checkExisteTables()
    {
        if(!file_exists(PATH_HOME . "entity/cache/user.json")) {
            Helper::createFolderIfNoExist(PATH_HOME . "entity");
            foreach (Helper::listFolder(PATH_HOME . 'vendor/conn/session-control/entity') as $item) {
                copy(PATH_HOME . 'vendor/conn/session-control/entity/' . $item, PATH_HOME . 'entity/' . $item);
                unlink(PATH_HOME . 'vendor/conn/session-control/entity/' . $item);
            }

            new \Entity\Entity("image_control");
            new \Entity\Entity("user_attempt");
            new \Entity\Entity("user_history");
        }
    }

    function criptografar($e)
    {
        return base64_encode(base64_encode("key" . $e . "noz") . "9");
    }

    $ip = filter_var(Helper::getIP(), FILTER_VALIDATE_IP);
    if($ip) {

        checkExisteTables();

        $login = new Login();
        $login->setEmail($dados['email']);
        $login->setSenha($dados['password']);
        if(!$login->checkMaxAttemptsExceded()) {
            $login->exeLogin();
            if ($login->getResult()) {

                echo json_encode(array("status" => "1", "mensagem" => $login->getError()));

            } else {

                $attempt = new \ConnCrud\TableCrud("user_attempt");
                $attempt->loadArray(array("ip" => $ip, "data" => date("Y-m-d H:i:s"), "email" => $dados['email'], "password" => criptografar($dados['password'])));
                $attempt->save();

                $cont = 10 - $login->getAttempts();
                $mensagem = $login->getError() . " " . ($cont > 0 ? "{$cont} tentativas faltantes" : " bloqueado por 15 minutos");

                echo json_encode(array("status" => "2", "mensagem" => $mensagem));

            }
        } else {
            echo json_encode(array("status" => "2", "mensagem" => "tentativas excedidas, tente novamente mais tarde"));
        }
    } else {
        echo json_encode(array("status" => "2", "mensagem" => "erro de autentificação"));
    }
} else {
    echo json_encode(array("status" => "2", "mensagem" => "login inválido! Informações ausentes"));
}