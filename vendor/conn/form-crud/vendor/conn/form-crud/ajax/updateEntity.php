<?php
$entityName = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$field = strip_tags(trim(filter_input(INPUT_POST, 'field', FILTER_DEFAULT)));
$value = filter_input(INPUT_POST, 'value', FILTER_DEFAULT);
$response = 0;
$error = null;

$field = explode('.', str_replace('dados.', '', $field));
$data = \Helpers\Helper::getArrayData($field, $value);
$error = $data;
if($id && $entityName && $field) {
    $entity = new \Entity\Entity($entityName);
    $entity->load($id);
    if (!$entity->getErro()) {
        $entity->setData($data);
        if (!$entity->getErro()) {
            $error = $entity->getData();
            $entity->save();
            if (!$entity->getErro()) {
                $response = 1;
            } else {
                $error = $entity->getErro();
            }
        } else {
            $error = $entity->getErro();
        }
    } else {
        $error = $entity->getErro();
    }
}

echo json_encode(array("response" => $response, "error" => $error));