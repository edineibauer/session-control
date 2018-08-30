<?php

$entityName = strip_tags(trim(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$title = strip_tags(trim(filter_input(INPUT_POST, 'title', FILTER_DEFAULT)));

if($title && $entityName) {
    $info = \Entity\Metadados::getInfo($entityName);
    $entity = new \Entity\Entity($entityName);

    $read = new \ConnCrud\Read();
    $read->exeRead(PRE . $entityName, "WHERE {$info['title']} = :title", "title={$title}");
    if($read->getResult()) {
        $entity->load($read->getResult()[0][$info['primary']]);
    } else {
        $entity->set($info['title'], $title);
    }

    $form = new FormCrud\Form($entity);
    echo $form->getForm();
}
