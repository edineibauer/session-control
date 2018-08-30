<?php

$entityName = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$id = filter_input(INPUT_POST, 'limit', FILTER_VALIDATE_INT);

$entity = new \Entity\Entity($entityName);
$entity->load($id);
if($entity->getErro()) {
    echo json_encode(array("response" => 0, "data" => $entity->getErro()));
} else {
    echo json_encode(array("response" => 1, "data" => $entity->getData()));
}