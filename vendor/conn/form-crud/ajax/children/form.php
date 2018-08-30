<?php
$entity = trim(strip_tags(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
$fields = trim(strip_tags(filter_input(INPUT_POST, 'fields', FILTER_DEFAULT)));
$fields = !empty($fields) ? json_decode($fields, true) : null;

$form = new \FormCrud\Form($entity);
$data['data'] = $form->getFormChildren($id ?? null, $fields ?? null);