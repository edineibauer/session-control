<?php
require('../../../../_config/config.php');

$folder = strip_tags(trim(filter_input(INPUT_POST, "folder", FILTER_DEFAULT)));

if (!empty($_FILES['file'])) {
    $erro = null;
    $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $nome = \Helpers\Check::name(str_replace(".{$extension}", "", $_FILES['file']['name']));
    $targetFile = PATH_HOME . $folder . DIRECTORY_SEPARATOR . $nome . '.' . $extension;

    Helpers\Helper::createFolderIfNoExist(PATH_HOME . $folder);
    move_uploaded_file($_FILES['file']['tmp_name'], $targetFile);

    //    $extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
//    if (!in_array(strtolower($extension), $allowed)) {
//        $erro = "extensão não permitida";
//
//    } else {
//    }
}
