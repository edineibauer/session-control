<?php
/**
 * Created by PhpStorm.
 * User: nenab
 * Date: 02/08/2017
 * Time: 21:07
 *
 * Criar a tabela dos usuários do sistema
 */

namespace SessionControl;

use ConnCrud\SqlCommand;

class LoginDataBase
{
    public function createDataBase()
    {
        $sql = new SqlCommand();
        $sql->exeCommand($this->createTableUser());
        $sql->exeCommand($this->getPrimaryKey("user"));
        $sql->exeCommand($this->getKeyUser());

        $sql->exeCommand($this->createTableLoginAttempt());
        $sql->exeCommand($this->getPrimaryKey("user_attempt"));

        $sql->exeCommand($this->createTableLoginToken());
        $sql->exeCommand($this->getPrimaryKey("user_token"));

        $sql->exeCommand($this->createTableSessao());
        $sql->exeCommand($this->getPrimaryKey("user_history"));
        $sql->exeCommand($this->getKeyUserHistory());

        $sql->exeCommand($this->getFKUser());
        $sql->exeCommand($this->getFKUserHistory());
    }

    private function createTableUser()
    {
        return "CREATE TABLE IF NOT EXISTS `" . $this->getPreTable("user") . "` (
              `id` int(11) NOT NULL,
              `imagem` int(11) DEFAULT NULL COMMENT '<<table>><<image>>',
              `nome` varchar(127) DEFAULT NULL COMMENT '<<title,table>>{{font-size20 font-bold}}',
              `urlname` varchar(127) DEFAULT NULL COMMENT '<<hidden>><?@#nome#@?>',
              `data_registro` datetime DEFAULT NULL COMMENT '<<hidden>>',
              `level` tinyint(1) DEFAULT '0' COMMENT '[[0,1,2,3,4,5,6,7,8,9]]',
              `token` int(11) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }

    private function createTableSessao()
    {
        return "CREATE TABLE IF NOT EXISTS `" . $this->getPreTable("user_history") . "` (
              `id` int(11) NOT NULL,
              `user` int(11) NOT NULL COMMENT '<<hidden>>',
              `url` varchar(127) NOT NULL COMMENT '<<hidden>>',
              `data` datetime NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }

    private function createTableLoginAttempt()
    {
        return "CREATE TABLE IF NOT EXISTS `" . $this->getPreTable("user_attempt") . "` (
              `id` int(11) NOT NULL,
              `data` datetime NOT NULL,
              `ip` varchar(32) NOT NULL,
              `email` varchar(64) NOT NULL,
              `password` varchar(64) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }

    private function createTableLoginToken()
    {
        return "CREATE TABLE IF NOT EXISTS `" . $this->getPreTable("user_token") . "` (
              `id` int(11) NOT NULL,
              `expire` datetime DEFAULT NULL COMMENT '<<hidden>>',
              `token` varchar(64) DEFAULT NULL COMMENT '<<hidden>>',
              `email` varchar(64) NOT NULL,
              `password` varchar(64) NOT NULL,
              `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '<<status,on>>[[0,1]]',
              `restore_code` varchar(127) DEFAULT NULL COMMENT '<<hidden>>'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }

    private function getPrimaryKey($table)
    {
        return"ALTER TABLE `" . $this->getPreTable($table) . "` ADD PRIMARY KEY (`id`), MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
    }

    private function getKeyUser()
    {
        return "ALTER TABLE `" . $this->getPreTable("user") . "` ADD KEY `token` (`token`)";
    }

    private function getFKUser()
    {
        return "ALTER TABLE `" . $this->getPreTable("user") . "` ADD CONSTRAINT `" . $this->getPreTable("user_ibfk_1") . "` FOREIGN KEY (`token`) REFERENCES `" . $this->getPreTable("user_token") . "` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION";
    }

    private function getKeyUserHistory()
    {
        return "ALTER TABLE `" . $this->getPreTable("user_history") . "` ADD KEY `user` (`user`)";
    }

    private function getFKUserHistory()
    {
        return "ALTER TABLE `" . $this->getPreTable("user_history") . "` ADD CONSTRAINT `sc_user_history_ibfk_1` FOREIGN KEY (`user`) REFERENCES `" . $this->getPreTable("user") . "` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION";
    }

    private function getPreTable($table = null)
    {
        if(defined('PRE')) {
            return ($table && !preg_match("/^" . PRE . "/i", $table) ? PRE : '') . $table;
        }

        return $table;
    }

    /*    private function getCreateTableGalleryInfo($table)
        {
            return "CREATE TABLE IF NOT EXISTS `rw_gallery` (
                  `id` int(11) NOT NULL,
                  `title` varchar(255) DEFAULT NULL COMMENT '<<title>>{{font-size20 font-bold}}',
                  `urlname` varchar(127) DEFAULT NULL COMMENT '<<hidden>><?@#title#@?>',
                  `cover` varchar(255) DEFAULT 'demo.jpg' COMMENT '<<file>><<image>>',
                  `user` int(11) DEFAULT NULL COMMENT '<<nofk>>',
                  `folder` varchar(64) DEFAULT NULL COMMENT '<<hidden>>',
                  `version` varchar(64) DEFAULT NULL COMMENT '<<hidden>>'
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
        }*/
}