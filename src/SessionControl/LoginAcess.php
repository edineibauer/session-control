<?php
/**
 * Created by PhpStorm.
 * User: nenab
 * Date: 02/08/2017
 * Time: 19:48
 *
 * @copyright (c) 2017, Edinei J. Bauer
 */

namespace SessionControl;

use \ConnCrud\TableCrud;

class LoginAcess extends StartSession
{
    private $logged;
    private $mensagem;


    public function __construct()
    {
        $this->logged = false;
        $this->mensagem = "Sem informações para conectar";
        $this->checkLogin();
    }


    /**
     * @return bool
     */
    public function isLogged(): bool
    {
        return $this->logged;
    }

    /**
     * @return mixed
     */
    public function getMensagem()
    {
        return $this->mensagem;
    }

    private function checkLogin()
    {
        if ($this->isLoggedIn()) {
            $this->checkSessionWrong();
        } else {
            $this->checkCookieInfo();
        }
    }

    private function isLoggedIn()
    {
        return isset($_SESSION['userlogin']);
    }

    private function checkSessionWrong()
    {
        if (!isset($_SESSION['userlogin']['email'])):
            $this->mensagem = "Informações ausentes na Sessão atual, desconectar";
            $this->unsetSession();
        endif;
    }

    private function unsetCookie()
    {
        if(isset($_SESSION['userlogin']['token'])) {
            $token = TableCrud("user_token");
            $token->load($_SESSION['userlogin']['token']);
            $token->token = "";
            $token->expire = "";
            $token->save();
        }
        setcookie("token", 0, time() - 1, "/");
    }

    private function unsetSession()
    {
        unset($_SESSION['userlogin']);
    }

    public function deslogar()
    {
        $this->unsetCookie();
        $this->unsetSession();
    }

    private function checkCookieInfo()
    {
        if (isset($_COOKIE['token'])) {

            $token = new TableCrud("user_token");
            $token->load("token", $_COOKIE['token']);
            if ($token->exist() && $token->status === 1 && $token->expire > date("Y-m-d H:i:s")) {

                $this->sessionStartLogin($token->id);
                $this->updateExpire($token->id);
                $this->logged = true;

            } else {
                $token->expire = date("Y-m-d H:i:s");
                $token->token = "";
                $token->save();

                $this->mensagem = "Informações do Cookie não válidos";
                $this->unsetCookie();
            }
        }
    }

}