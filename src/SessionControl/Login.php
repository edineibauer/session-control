<?php

/**
 * Login.class [ MODEL ]
 * Responável por autenticar, validar, e checar usuário do sistema de login!
 *
 * @copyright (c) 2017, Edinei J. Bauer
 */

namespace SessionControl;

use \ConnCrud\TableCrud;
use Helpers\Check;
use Helpers\Helper;

class Login extends StartSession
{
    private $email;
    private $senha;
    private $recaptcha;

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
        $this->senha = (string)$this->encrypt(trim($senha));
    }

    /**
     * @param mixed $recaptcha
     */
    public function setRecaptcha($recaptcha)
    {
        $this->recaptcha = $recaptcha;
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
                $this->setError('usuário inválido! Por favor tente novamente');
            }
        }
    }

    private function isHuman()
    {
        if (defined("RECAPTCHA") && $this->recaptcha) {
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
