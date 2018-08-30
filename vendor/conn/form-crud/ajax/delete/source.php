<?php
$entity = trim(strip_tags(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$column = trim(strip_tags(filter_input(INPUT_POST, 'column', FILTER_DEFAULT)));
$name = trim(strip_tags(filter_input(INPUT_POST, 'name', FILTER_DEFAULT)));
$data['data'] = trim(strip_tags(filter_input(INPUT_POST, 'files', FILTER_DEFAULT)));
$files = json_decode($data['data'], true);

if ($name && !empty($name)) {
    foreach ($files as $i => $file) {
        if ($name === $file['name']) {
            unset($files[$i]);
            $data['data'] = empty($files) ? null : json_encode(array_values($files));

            if (file_exists(PATH_HOME . $file['url']))
                unlink(PATH_HOME . $file['url']);

            break;
        }
    }
}