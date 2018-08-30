<?php
$nome = trim(strip_tags(filter_input(INPUT_POST, 'entity', FILTER_DEFAULT)));
$save = filter_input(INPUT_POST, 'save', FILTER_VALIDATE_BOOLEAN);
$save = $save ?? true;
$dados = filter_input(INPUT_POST, 'dados', FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
$cont = [];

foreach ($dados as $c => $v) {
    $c = explode(".", $c);
    if (count($c) === 2)
        $cont[$c[1]] = $v;
    elseif (count($c) === 3)
        $cont[$c[1]][$c[2]] = $v;
    elseif (count($c) === 4)
        $cont[$c[1]][$c[2]][$c[3]] = $v;
    elseif (count($c) === 5)
        $cont[$c[1]][$c[2]][$c[3]][$c[4]] = $v;
    elseif (count($c) === 6)
        $cont[$c[1]][$c[2]][$c[3]][$c[4]][$c[5]] = $v;
    elseif (count($c) === 7)
        $cont[$c[1]][$c[2]][$c[3]][$c[4]][$c[5]][$c[6]] = $v;
    elseif (count($c) === 8)
        $cont[$c[1]][$c[2]][$c[3]][$c[4]][$c[5]][$c[6]][$c[7]] = $v;
    elseif (count($c) === 9)
        $cont[$c[1]][$c[2]][$c[3]][$c[4]][$c[5]][$c[6]][$c[7]][$c[8]] = $v;
    else
        $cont = $v;
}

$data['data'] = \Entity\Entity::add($nome, $cont, $save);