<?php

namespace SessionControl;

use \ConnCrud\Read;
use \ConnCrud\TableCrud;
use ConnCrud\Update;
use Helpers\Check;
use Helpers\Helper;
use \ReCaptcha\ReCaptcha;

class Login
{
    private $email;
    private $senha;
    private $recaptcha;
    private $attempts = 0;
    private $result;

    /**
     * @param mixed $data
     */
    public function __construct($data = null)
    {
        if ($data) {
            if (isset($data['email']) && !empty($data['email']))
                $this->setEmail($data['email']);
            if (isset($data['password']) && !empty($data['password']))
                $this->setSenha($data['password']);
            if (isset($data['recaptcha']) && !empty($data['recaptcha']))
                $this->setRecaptcha($data['recaptcha']);
        }
    }

    /**
     * @param mixed $result
     */
    public function setResult($result)
    {
        $this->result = $result;
    }

    /**
     * @param string $email
     */
    public function setEmail($email)
    {
        if (!empty($email))
            $this->email = (string)strip_tags(trim($email));
        $this->start();
    }

    /**
     * @param string $senha
     */
    public function setSenha($senha)
    {
        if (!empty($senha))
            $this->senha = (string)Check::password(trim($senha));
        $this->start();
    }

    /**
     * @param mixed $recaptcha
     */
    public function setRecaptcha($recaptcha)
    {
        $this->recaptcha = $recaptcha;
        $this->start();
    }

    /**
     * @return mixed
     */
    public function getResult()
    {
        return $this->result;
    }

    public function logOut()
    {
        if (isset($_SESSION['userlogin'])) {
            if(isset($_SESSION['userlogin']['token']) && !empty($_SESSION['userlogin']['token'])) {
                $token = new TableCrud(PRE . "login");
                $token->load("token", $_SESSION['userlogin']['token']);
                if ($token->exist()) {
                    $token->setDados(["token" => null, "token_expira" => null]);
                    $token->save();
                }
            }

            unset($_SESSION['userlogin']);
            setcookie("token", 0, time() - 1, "/");

            header("Location: " . HOME . "dashboard");
        }
    }

    private function start()
    {
        if ($this->email && $this->senha && !$this->attemptExceded()) {
            if (LOGGED)
                $this->setResult('Você já esta logado.');
            elseif ($this->isHuman())
                $this->checkUserInfo();

        } elseif ($this->email && $this->senha) {
            $cont = 10 - $this->attempts;
            $this->setResult($cont > 0 ? "{$cont} tentativas faltantes" : " bloqueado por 15 minutos");
        }
    }

    /**
     * Vetifica usuário e senha no banco de dados!
     */
    private function checkUserInfo()
    {
        $read = new Read();
        $read->exeRead(PRE . "login", "WHERE (email = :email || nome_usuario = :email) && password = :pass", "email={$this->email}&pass={$this->senha}");

        if ($read->getResult() && $read->getResult()[0]['status'] === '1' && !$this->getResult()) {
            $_SESSION['userlogin'] = $read->getResult()[0];
            $up = new Update();
            $up->exeUpdate(PRE . "login", ['token' => $this->getToken(), "token_expira" => date("Y-m-d H:i:s"), "token_recovery" => null],"WHERE (email = :email || nome_usuario = :email) && password = :pass", "email={$this->email}&pass={$this->senha}");
            $this->setCookie($_SESSION['userlogin']['token']);
        } else {
            if ($read->getResult())
                $this->setResult('Usuário Desativado!');
            else
                $this->setResult('Login Inválido!');

            $attempt = new TableCrud("login_attempt");
            $attempt->loadArray(array("ip" => filter_var(Helper::getIP(), FILTER_VALIDATE_IP), "data" => date("Y-m-d H:i:s"), "username" => $this->email));
            $attempt->save();
        }
    }

    private function attemptExceded()
    {
        $ip = filter_var(Helper::getIP(), FILTER_VALIDATE_IP);
        $read = new Read();
        $read->exeRead(PRE . "login_attempt", "WHERE data > DATE_SUB(NOW(), INTERVAL 15 MINUTE) && ip = '{$ip}' && email = '{$this->email}'");
        $this->attempts = $read->getRowCount();

        return ($this->attempts > 10); // maximo de 10 tentativas por IP e email iguais em um intervalo de 15 minutos
    }

    private function isHuman()
    {
        if (defined("RECAPTCHA") && $this->attempts < 6) {
            if (empty($this->recaptcha))
                $this->setResult("resolva o captcha");

            $recaptcha = new ReCaptcha(RECAPTCHA);
            $resp = $recaptcha->verify($this->recaptcha, filter_var(Helper::getIP(), FILTER_VALIDATE_IP));
            if (!$resp->isSuccess())
                $this->setResult('<p>' . implode('</p><p>', $resp->getErrorCodes()) . '</p>');
        }

        return $this->getResult() ? false : true;
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
}
