<?php

/**
 * Login.class [ MODEL ]
 * Responável por autenticar, validar, e checar usuário do sistema de login!
 *
 * @copyright (c) 2017, Edinei J. Bauer
 */

namespace SessionControl;

use \ConnCrud\Read;
use \ConnCrud\TableCrud;
use Helpers\Check;
use Helpers\Helper;

class Login extends StartSession
{
    private $email;
    private $senha;
    private $recaptcha;
    private $attempts = 0;

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        $this->email = (string)strip_tags(trim($email));
    }

    /**
     * @param string $senha
     */
    public function setSenha($senha)
    {
        $this->senha = (string)$this->encrypt(strip_tags(trim($senha)));
    }

    /**
     * @param mixed $recaptcha
     */
    public function setRecaptcha($recaptcha)
    {
        $this->recaptcha = $recaptcha;
    }

    /**
     * @return mixed
     */
    public function getAttempts()
    {
        return $this->attempts;
    }

    public function checkAttemptsExceded()
    {
        $ip = filter_var(Helper::getIP(), FILTER_VALIDATE_IP);
        $read = new Read();
        $read->exeRead(PRE . "user_attempt", "WHERE data > DATE_SUB(NOW(), INTERVAL 15 MINUTE) && ip = :ip", "ip={$ip}");
        if ($read->getResult() && $read->getRowCount() > 3) {
            return true;
        }

        return false;
    }

    public function checkMaxAttemptsExceded()
    {
        $ip = filter_var(Helper::getIP(), FILTER_VALIDATE_IP);
        $read = new Read();
        $read->exeRead(PRE . "user_attempt", "WHERE data > DATE_SUB(NOW(), INTERVAL 15 MINUTE) && ip = '{$ip}' && email = '{$this->email}'");
        $this->attempts = $read->getRowCount();

        return ($this->attempts > 10); // maximo de 10 tentativas por IP e email iguais em um intervalo de 15 minutos
    }

    public function logOut()
    {
        if(!VISITANTE && isset($_SESSION['userlogin']['token'])) {
            $token = new TableCrud("user_token");
            $token->load($_SESSION['userlogin']['token']);
            if ($token->exist()) {
                $token->token = "";
                $token->expire = "";
                $token->save();
                $this->setResult("Desconectado, redirecionando...");
            }

            setcookie("token", 0, time() - 1, "/");
            unset($_SESSION['userlogin']);
        }
    }

    /**
     * <b>Efetuar Login:</b> Envelope um array atribuitivo com índices STRING user [email], STRING pass.
     * Ao passar este array na ExeLogin() os dados são verificados e o login é feito!
     * @param $data = user [email], pass
     */
    public function exeLogin(array $data = null)
    {
        if (isset($data['email']) && isset($data['password'])) {
            $this->setEmail($data['email']);
            $this->setSenha($data['password']);
            if(isset($data['recaptcha']) && !empty($data['recaptcha'])) {
                $this->setRecaptcha($data['recaptcha']);
            }
        }
        $this->setLogin();
    }

    private function setLogin()
    {
        if (!$this->email || !$this->senha) {
            $this->setError('Email e Senha são necessários para efetuar o login!');
        } elseif (!Check::email($this->email)) {
            $this->setError('Formato de Email inválido!');
        } elseif (!VISITANTE) {
            $this->setError('Você já esta logado atualmente.');
        } else {
            $this->checkUserInfo();
        }
    }

    //Vetifica usuário e senha no banco de dados!
    private function checkUserInfo()
    {
        if ($this->isHuman()) {
            $token = new TableCrud($this->getTable());
            $token->loadArray(array("email" => $this->email, "password" => $this->senha));
            if ($token->exist()) {
                if ($token->status === 0) {
                    $this->setError('usuário desativado!');
                } else {

                    $this->sessionStartLogin($token->id);
                    $this->updateExpire($token->id);

                }
            } else {
                $this->setError('usuário inválido!');
            }
        }
    }

    private function isHuman()
    {
        if (defined("RECAPTCHA") && $this->checkAttemptsExceded()) {
            if(empty($this->recaptcha)) {
                $this->setError("resolva o captcha");
                return false;
            }

            $recaptcha = new \ReCaptcha\ReCaptcha(RECAPTCHA);
            $resp = $recaptcha->verify($this->recaptcha, filter_var(Helper::getIP(), FILTER_VALIDATE_IP));
            if (!$resp->isSuccess()) {
                $this->setError('<p>' . implode('</p><p>', $resp->getErrorCodes()) . '</p>');
                return false;
            }
        }

        return true;
    }

    private function encrypt($senha)
    {
        $senha = md5("Control" . trim($senha) . "Session");
        $key1 = array('1', 'c', 's', '2', 'r', 'o', 'n', 'l', 'f', 'x', '0', 'k', 'v', '5', 'y');
        $key2 = array('b', '4', '9', '6', 'w', 'a', 'd', '3', 'z', '7', 'j', 'm', '8', 'h', 't');
        return md5(str_replace($key1, $key2, $senha));
    }
}
