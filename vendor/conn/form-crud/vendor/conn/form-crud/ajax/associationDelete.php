<?php
$entityName = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$entityFieldName = strip_tags(trim(filter_input(INPUT_POST, 'entityField', FILTER_DEFAULT)));
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$value = filter_input(INPUT_POST, 'value', FILTER_DEFAULT);

$response = 0;
$erro = null;
$idField = 0;

if ($id && $entityName && $entityFieldName && $value) {

    $info = \Entity\Metadados::getInfo($entityFieldName);

    if (is_numeric($value)) {
        $idField = (int)$value;

    } elseif (is_string($value)) {
        $value = strip_tags(trim($value));
        $read = new \ConnCrud\Read();
        $read->exeRead(PRE . $entityFieldName, "WHERE {$info['title']} = '{$value}'");
        if (!$read->getResult()) {
            $erro = "id ou title não encontrado";
        } else {
            $idField = (int) $read->getResult()[0][$info['primary']];
        }
    }

    if (!$erro) {
        $del = new \ConnCrud\Delete();
        $del->exeDelete(PRE . $entityName . '_' . $entityFieldName, "WHERE {$entityName}_id = :id && {$entityFieldName}_id = :entid", "id={$id}&entid={$idField}");
        $response = 1;
    }
}

echo json_encode(array("response" => $response, "error" => $erro));