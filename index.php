<?php
ob_start();
require_once './_config/config.php';
require_once './vendor/autoload.php';

use Helpers\Check;
use Helpers\Template;
use LinkControl\Link;

$link = new Link();
$view = new Template("link-control");
$teste = true;

if(!Check::ajax()){
    $view->show("header", $link->getParam());
    require_once $link->getRoute();
    $view->show("footer", $link->getParam());
} else {
    require_once $link->getRoute();
}

ob_get_flush();