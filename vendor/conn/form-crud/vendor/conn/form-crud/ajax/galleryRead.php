<?php

$folder = strip_tags(trim(filter_input(INPUT_POST, "folder", FILTER_DEFAULT)));

echo json_encode(array('data' => Helpers\Helper::listFolder(PATH_HOME . $folder, 2000)));