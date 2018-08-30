<?php

$link = strip_tags(trim(filter_input(INPUT_POST, "link", FILTER_DEFAULT)));
$folder = strip_tags(trim(filter_input(INPUT_POST, "folder", FILTER_DEFAULT)));
$response = 0;
$data = "";
if(\Helpers\Check::image($link)) {
    $name = explode("/", $link);
    $data = $name[count($name) - 1];

    if(!file_exists(PATH_HOME . $folder . DIRECTORY_SEPARATOR . $data)) {
        copy($link, PATH_HOME . $folder . DIRECTORY_SEPARATOR . $data);
        $response = 1;
    } else {
        $response = 2;
    }
}

echo json_encode(array("response" => $response, "data" => $data));