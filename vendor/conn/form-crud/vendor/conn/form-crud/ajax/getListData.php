<?php

$entity = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$search = strip_tags(trim(filter_input(INPUT_POST, 'search', FILTER_DEFAULT)));
$limit = filter_input(INPUT_POST, 'limit', FILTER_VALIDATE_INT);

$info = \Entity\Metadados::getInfo($entity);
$response = 0;
$data = null;
$dataId = null;

$read = new \ConnCrud\Read();
$read->exeRead(PRE . $entity, "WHERE {$info['title']} LIKE '%" . $search . "%' ORDER BY {$info['primary']} DESC LIMIT {$limit}");
if($read->getResult()) {
    $response = 1;
    foreach ($read->getResult() as $item) {
        $data[$item[$info['title']]] = $item[$info['primary']];
    }
}

echo json_encode(array("response" => $response, "data" => $data));