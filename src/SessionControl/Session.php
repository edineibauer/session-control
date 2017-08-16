<?php

/**
 * Session.class [ HELPER ]
 * Responsável pelas estatísticas, sessões e atualizações de tráfego do sistema!
 *
 * @copyright (c) 2017, Edinei J. Bauer
 */

namespace SessionControl;

use ConnCrud\TableCrud;
use \SessionControl\LoginAcess;

class Session
{
    private $level;

    function __construct()
    {
        session_start();
        $this->checkLogin();
    }

    public function setLevelAccess($level, $titulo, $url, $descricao = null)
    {
        $access = new LevelAccess();
        $access->setLevel($level);
        $access->setTitulo($titulo);
        $access->setUrl($url);
        $access->setDescricao($descricao);
        $this->level[$level] = $access;
    }

    /*
     * ***************************************
     * ********   SESSÃO DO USUÁRIO   ********
     * ***************************************
     */

    private function checkLogin()
    {
        $login = new LoginAcess();
        if ($login->isLogged()) {
            $this->defineLevel();
            $this->accessHistory();
            define("VISITANTE", false);
        } else {
            define("VISITANTE", true);
        }
    }

    private function defineLevel()
    {
        foreach ($this->level as $nivel => $dados) {
            if ($_SESSION['userlogin']['level'] == $nivel) {
                define(strtoupper($dados->getTitulo()), true);
                $_SESSION['userdata']['urlAdm'] = $dados->getUrl();
            } else {
                define(strtoupper($dados->getTitulo()), false);
            }
        }
    }

    private function accessHistory()
    {
        $dados = array(
            "user" => $_SESSION['userlogin']['id'],
            "url" => $_SERVER["REQUEST_URI"],
            "data" => date("Y-m-d H:i:s")
        );

        $sessao = new TableCrud("user_history");
        $sessao->loadArray($dados);
        $sessao->save();
    }
}
