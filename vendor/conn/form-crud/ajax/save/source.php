<?php

/**
 * @param string $column
 * @param array $dicionario
 * @param array $info
 * @param array $file
 * @return array
 */
function addFile(string $column, array $dicionario, array $info, array $file) : array
{
    $dados['response'] = 1;

    if ($file['error'] === 0) {
        $extensao = pathinfo($file['name'], PATHINFO_EXTENSION);
        \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "uploads");

        foreach ($info["source"] as $type => $ids) {
            if(!empty($ids)) {
                foreach ($ids as $i) {
                    if ($dicionario[$i]['column'] === $column) {
                        \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "uploads" . DIRECTORY_SEPARATOR . $type);
                        \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "uploads" . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR . date("Y"));
                        \Helpers\Helper::createFolderIfNoExist(PATH_HOME . "uploads" . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR . date("Y") . DIRECTORY_SEPARATOR . date("m"));

                        $name = "uploads" . DIRECTORY_SEPARATOR . $type . DIRECTORY_SEPARATOR . date("Y") . DIRECTORY_SEPARATOR . date("m") . DIRECTORY_SEPARATOR . \Helpers\Check::name(str_replace(".{$extensao}", "", $file['name'])) . "." . strtolower($extensao);

                        if ($dicionario[$i]["size"] && strlen($name) > $dicionario[$i]["size"]) {
                            $dados['data'] = "nome do arquivo muito grande";
                            $dados['response'] = 2;
                        } else {
                            if (move_uploaded_file($file['tmp_name'], $name)) {
                                $dados['data']['url'] = $name;
                                $dados['data']['type'] = $file['type'];
                                $dados['data']['size'] = $file['size'];
                                $dados['data']['name'] = $file['name'];
                            }
                        }
                    }
                }
            }
        }
    }

    return $dados;
}

$entity = trim(strip_tags(filter_input(INPUT_POST, "entity", FILTER_DEFAULT)));
$column = trim(strip_tags(filter_input(INPUT_POST, "column", FILTER_DEFAULT)));
$dicionario = \EntityForm\Metadados::getDicionario($entity);
$info = \EntityForm\Metadados::getInfo($entity);

if(!empty($_FILES['file']) && !empty($info["source"])) {
    $data['id'] = "#" . $entity . "-" . $column;
    if(is_array($_FILES['file']['name'])) {
        $dados = [];
        for($i=0;$i< count($_FILES['file']['name']); $i++) {
            $file = ["name" => $_FILES['file']['name'][$i], "tmp_name" => $_FILES['file']['tmp_name'][$i], "type" => $_FILES['file']['type'][$i], "error" => $_FILES['file']['error'][$i], "size" => $_FILES['file']['size'][$i]];
            $dados[$i] = addFile($column, $dicionario, $info, $file);
        }
        $data['data'] = json_encode($dados);
    } else {
        $data['data'] = json_encode([0 => addFile($column, $dicionario, $info, $_FILES['file'])]);
    }
}