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

use ConnCrud\Read;
use ConnCrud\SqlCommand;

class LoginDataBase
{
    public function createDataBase($table)
    {
        $sql = new SqlCommand();
        $sql->exeCommand($this->getCreateTableInfo($table));
        $sql->exeCommand($this->getPrimaryKey($table));
        $sql->exeCommand($this->getAutoIncrementKey($table));
    }

    private function getCreateTableGalleryInfo($table)
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
    }

    private function getCreateTableInfo($table)
    {
        return "CREATE TABLE IF NOT EXISTS defined('PRE') `" . $this->getPre() . $table . "` (
              `id` int(11) NOT NULL,
              `imagem` int(11) DEFAULT NULL COMMENT '<<table>><<image>>',
              `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '<<status,on>>[[0,1]]',
              `nome` varchar(127) DEFAULT NULL COMMENT '<<title,table>>{{font-size20 font-bold}}',
              `urlname` varchar(127) DEFAULT NULL COMMENT '<<hidden>><?@#nome#@?>',
              `email` varchar(64) NOT NULL COMMENT '<<table>><<email>>',
              `password` varchar(64) DEFAULT NULL COMMENT '<<hidden>>',
              `level` tinyint(1) DEFAULT '0' COMMENT '[[0,1,2,3,4,5,6,7,8,9]]',
              `data_registro` datetime DEFAULT NULL COMMENT '<<hidden>>',
              `code` varchar(255) DEFAULT NULL COMMENT '<<hidden>>'
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
    }

    private function getPrimaryKey($table)
    {
        return "ALTER TABLE `" . $this->getPre() . $table . "` ADD PRIMARY KEY (`id`), ADD KEY `gallery_id` (`imagem`)";
    }

    private function getAutoIncrementKey($table)
    {
        return "ALTER TABLE `" . $this->getPre() . $table . "` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;";
    }

    private function getPre()
    {
        return (defined('PRE') ? PRE : '');
    }
}