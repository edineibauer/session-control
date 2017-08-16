<?php
/**
 * Created by PhpStorm.
 * User: nenab
 * Date: 09/08/2017
 * Time: 20:59
 */

namespace SessionControl;

use \ConnCrud\TableCrud;

abstract class StartSession
{
    private $error;
    private $result;
    private $table;
    /**
     * @param mixed $table
     */
    public function setTable($table)
    {
        $this->table = $this->getPre($table);
    }

    /**
     * @param mixed $error
     */
    public function setError($error)
    {
        $this->error = $error;
    }

    /**
     * @param mixed $result
     */
    public function setResult($result)
    {
        $this->result = $result;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }

    /**
     * @return string
     */
    public function getTable(): string
    {
        return (!$this->table ? $this->getPre("user_token") : $this->table);
    }

    /**
     * @return mixed
     */
    public function getResult()
    {
        return $this->result;
    }

    //Executa o login armazenando a sessão e cookies!
    protected function sessionStartLogin($id)
    {
        if (!session_id()):
            session_start();
        endif;

        $user = new TableCrud("user");
        $user->load('token', $id);
        if ($user->exist()) {
            $_SESSION['userlogin'] = $user->getDados();

            $this->error = "Seja bem vindo(a) {$_SESSION['userlogin']['nome']}. Redirecionando!";
            $this->result = true;
        }
    }

    protected function updateExpire($id)
    {
        $token = new TableCrud("user_token");
        $token->load($id);
        $token->token = $this->getToken();
        $expireTwoMonth = new \DateTime();
        $token->expire = $expireTwoMonth->modify('+2 month')->format('Y-m-d H:i:s');
        $token->save();

        $this->setCookie($token->token);
    }

    private function setCookie($token)
    {
        setcookie("token", $token, time() + (86400 * 30 * 2), "/"); // 2 meses de cookie
    }

    /**
     * @return string
     */
    private function getToken()
    {
        return md5("tokes" . rand(9999, 99999) . md5(base64_encode(date("Y-m-d H:i:s"))) . rand(0, 9999));
    }

    private function getPre($table)
    {
        return (defined('PRE') && !preg_match("/^" . PRE . "/i", $table) ? PRE : '') . $table;
    }
}