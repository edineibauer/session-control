<?php

$entity = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$dados = filter_input(INPUT_POST, 'dados', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

if($dados && $entity) {
    $entity = new \Entity\Entity($entity);
    $entity->setData($dados);
    if($entity->getErro()) {
        echo json_encode(array_merge(array("response" => 0, "mensagem" => "corrija os erros"), array("error" => $entity->getErro())));

    }else {
        $id = $entity->save();
        if ($entity->getErro()) {
            echo json_encode(array_merge(array("response" => 0, "mensagem" => "corrija os erros"), array("error" => $entity->getErro())));

        } else {
            echo json_encode(array("response" => 1, "mensagem" => "salvo", "id" => $id, "title" => $entity->get($entity->getMetadados()['info']['title'])));
        }
    }
} else {
    echo json_encode(array("response" => 1, "mensagem" => "dados não recebidos"));
}
