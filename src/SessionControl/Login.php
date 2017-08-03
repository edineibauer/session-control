<?php

/**
 * Login.class [ MODEL ]
 * Responável por autenticar, validar, e checar usuário do sistema de login!
 *
 * @copyright (c) 2014, Edinei J. Bauer NENA PRO
 */

namespace SessionControl;

use \ConnCrud\TableCrud;

class Login
{

    private $email;
    private $senha;
    private $error;
    private $result;
    private $table = "user";

    /**
     * <b>Informar Level:</b> Informe o nível de acesso mínimo para a área a ser protegida.
     * @param INT $Level = Nível mínimo para acesso
     */
    function __construct()
    {
        //        $this->Level = (int) $Level;
        //        $this->Pre = (string) $pre;
        //        if (isset($user) && !empty($user)):
        //            $this->Email = (string) ($user['email'] ? $user['email'] : '');
        //            $this->Senha = (string) ($user['password'] ? $user['password'] : '');
        //        endif;
        //        $this->User_banco = $this->Pre . "user";
    }

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
    public function setSenha($senha, $middleEncrypt = null)
    {
        $this->senha = (string) !$middleEncrypt ? $this->encryptMiddle(trim($senha)) : trim($senha);
    }

    /**
     * <b>Efetuar Login:</b> Envelope um array atribuitivo com índices STRING user [email], STRING pass.
     * Ao passar este array na ExeLogin() os dados são verificados e o login é feito!
     * @param ARRAY $data = user [email], pass
     */
    public function exeLogin(array $data = null)
    {
        if ($data && isset($data['email']) && isset($data['password'])) {
            $this->setEmail($data['email']);
            $this->setSenha($data['password']);
        }
        $this->setLogin();
    }

    /**
     * <b>Verificar Login:</b> Executando um getResult é possível verificar se foi ou não efetuado
     * o acesso com os dados.
     * @return BOOL $Var = true para login e false para erro
     */
    public function getResult()
    {
        return $this->result;
    }

    /**
     * <b>Obter Erro:</b> Retorna um array associativo com uma mensagem e um tipo de erro WS_.
     * @return ARRAY $Error = Array associatico com o erro
     */
    public function getError()
    {
        return $this->error;
    }

    private function setLogin()
    {
        if (!$this->email || !$this->senha) {
            $this->error = 'Email e Senha são necessários para efetuar o login!';
        } elseif (!$this->checkEmail($this->email)) {
            $this->error = 'Formato de Email inválido!';
        }

        $this->checkUserInfo();
    }

    //Vetifica usuário e senha no banco de dados!
    private function checkUserInfo()
    {
        $user = new TableCrud(defined('PRE) ? PRE' : "" . $this->table);
        $user->loadArray(array("email" => $this->email, "password" => $this->encryptMiddleEnd($this->senha)));
        if($user->exist()) {
            $this->sessionStartLogin($user->getDados());
        } else {
            $this->error = 'usuário inválido! Por favor tente novamente';
        }
    }

    //Executa o login armazenando a sessão e cookies!
    private function sessionStartLogin($dados)
    {
        if (!session_id()):
            session_start();
        endif;

        unset($dados['password']);
        $_SESSION['userlogin'] = $dados;
        $this->setCookies();

        $this->error = "Seja bem vindo(a) {$dados['nome']}. Aguarde redirecionamento!";
        $this->result = true;
    }

    private function setCookies()
    {
        setcookie("pmail", $this->criptografar($this->senha), time() + (86400 * 30 * 3), "/");
        setcookie("ppass", $this->criptografar($this->email), time() + (86400 * 30 * 3), "/");
    }

    /**
     * <b>Criptografar:</b> Criptografa dados em uma determinada ordem, de modo a ser recuperada
     */
    private function criptografar($e)
    {
        return base64_encode(base64_encode("key" . $e . "noz") . "9");
    }

    private function encryptMiddle($senha)
    {
        return (string)md5("Control" . trim($senha) . "Session");
    }

    private function encryptMiddleEnd($senha)
    {
        $key1 = array('1', 'c', 's', '2', 'r', 'o', 'n', 'l', 'f', 'x', '0', 'k', 'v', '5', 'y');
        $key2 = array('b', '4', '9', '6', 'w', 'a', 'd', '3', 'z', '7', 'j', 'm', '8', 'h', 't');
        return md5(str_replace($key1, $key2, $senha));
    }

    private static function checkEmail($email)
    {
        $format = '/[a-z0-9_\.\-]+@[a-z0-9_\.\-]*[a-z0-9_\.\-]+\.[a-z]{2,4}$/';

        if (preg_match($format, $email)):
            return true;
        else:
            return false;
        endif;
    }

}
