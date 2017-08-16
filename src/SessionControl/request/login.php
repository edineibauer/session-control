<?php
require('../../../_config/config.php');



use SessionControl\Login;
use ConnCrud\Read;
use Helpers\Helper;

$dados['email'] = filter_input(INPUT_POST, "email", FILTER_VALIDATE_EMAIL);
$dados['password'] = filter_input(INPUT_POST, "pass", FILTER_DEFAULT);

if ($dados['email'] && $dados['password']) {

    function checkExisteTables()
    {
        $table = (defined('PRE') ? PRE : "") . "user_attempt";
        $db = DATABASE;
        $read = new \ConnCrud\InfoTable();
        $read->exeRead("COLUMNS", "WHERE TABLE_SCHEMA = :nb && TABLE_NAME = :nt", "nb={$db}&nt={$table}");
        if (!$read->getResult()):
            $database = new \SessionControl\LoginDataBase();
            $database->createDataBase();
        endif;
    }

    function criptografar($e)
    {
        return base64_encode(base64_encode("key" . $e . "noz") . "9");
    }

    $ip = filter_var(Helper::getIP(), FILTER_VALIDATE_IP);
    if($ip) {

        checkExisteTables();

        $read = new Read();
        $read->exeRead(PRE . "user_attempt", "WHERE data > DATE_SUB(NOW(), INTERVAL 15 MINUTE) && ip = :ip", "ip={$ip}");
        if ($read->getResult() && $read->getRowCount() > 6) {
            echo json_encode(array("status" => "2", "mensagem" => "tente novamente mais tarde"));
        } else {

            $login = new Login();
            $login->exeLogin($dados);
            if (!$login->getResult()) {

                $attempt = new \ConnCrud\TableCrud("user_attempt");
                $attempt->loadArray(array("ip" => $ip, "data" => date("Y-m-d H:i:s"), "email" => $dados['email'], "password" => criptografar($dados['password'])));
                $attempt->save();

                $cont = 6 - $read->getRowCount();
                echo json_encode(array("status" => "2", "mensagem" => "login inválido! " . ($cont > 0 ? "{$cont} tentativas para bloqueio temporário" : " bloqueado por 15 minutos")));

            } else {

                echo json_encode(array("status" => "1", "mensagem" => "login com sucesso"));
            }
        }
    } else {
        echo json_encode(array("status" => "2", "mensagem" => "erro de autentificação"));
    }
} else {
    echo json_encode(array("status" => "2", "mensagem" => "login inválido! Informações ausentes"));
}