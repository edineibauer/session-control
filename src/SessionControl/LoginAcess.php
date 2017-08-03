<?php
/**
 * Created by PhpStorm.
 * User: nenab
 * Date: 02/08/2017
 * Time: 19:48
 */

namespace SessionControl;

class LoginAcess
{
    private $result;
    private $mensagem;

    /**
     * @return mixed
     */
    public function getResult()
    {
        return $this->result;
    }

    /**
     * @return mixed
     */
    public function getMensagem()
    {
        return $this->mensagem;
    }

    public function __construct()
    {
        $this->mensagem = "Sem informações para conectar";
        $this->checkLogin();
    }

    private function checkLogin()
    {
        if ($this->isLogged()) {
            $this->checkSessionWrong();
            $this->checkCookieWrong();
            $this->checkStatusAccount();
        } else {
            $this->checkCookieInfo();
        }
    }

    private function checkStatusAccount()
    {
        if (isset($_SESSION['userlogin']['status']) && $_SESSION['userlogin']['status'] < 1){
            $this->mensagem = "Usuário desativado, não permitido o login";
            $this->deslogar();
        } else {
            $this->result = true;
        }
    }

    private function isLogged()
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

    private function checkCookieWrong()
    {
        if (isset($_SESSION['userlogin']['email']) && isset($_COOKIE['pmail']) && $_SESSION['userlogin']['email'] != base64_decode($_COOKIE['pmail'])):
            $this->mensagem = "Cookies não conferem com Sessão atual, desconectar";
            $this->unsetCookie();
        endif;
    }

    private function unsetCookie()
    {
        setcookie("pmail", 0, time() - 1, "/");
        setcookie("ppass", 0, time() - 1, "/");
    }

    private function unsetSession()
    {
        unset($_SESSION['userlogin']);
    }

    public function deslogar()
    {
        $this->unsetSession();
        $this->unsetCookie();
    }

    private function checkCookieInfo()
    {
        if (isset($_COOKIE['pmail']) && !isset($_SESSION['userlogin'])) {
            $cookies['password'] = $this->descriptografar($_COOKIE['pmail']);
            $cookies['email'] = $this->descriptografar($_COOKIE['ppass']);

            $login = new Login();
            $login->setEmail($cookies['email']);
            $login->setSenha($cookies['password'], true);
            $login->exeLogin();
            if ($login->getResult()) {
                $this->mensagem = "Login realizado com informações do Cookie!";
                $this->checkStatusAccount();
            } else {
                $this->mensagem = "Informações dos Cookies não conferem, cookies deletados";
                $this->unsetCookie();
            }
        }
    }

    private function descriptografar($stringCriptografada)
    {
        return substr(base64_decode(substr(base64_decode($stringCriptografada), 0, -1)), 3, -3);
    }

}