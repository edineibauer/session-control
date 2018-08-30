<?php

namespace FormCrud;

use ConnCrud\Read;
use Entity\Entity;
use EntityForm\Dicionario;
use EntityForm\Meta;
use Helpers\Template;

class Form
{
    private $entity;
    private $autoSave = true;
    private $callback;
    private $fields;
    private $children;
    private $error;

    /**
     *
     * @param string $entity
     */
    public function __construct(string $entity)
    {
        $this->setEntity($entity);
    }

    /**
     * @param mixed $entity
     */
    public function setEntity($entity)
    {
        $this->entity = $entity;
    }

    /**
     * @param mixed $autoSave
     */
    public function setAutoSave($autoSave = null)
    {
        $this->autoSave = $autoSave === null ? !$this->autoSave : $autoSave;
    }

    /**
     * @param mixed $callback
     */
    public function setCallback($callback)
    {
        $this->callback = $callback;
    }

    public function setChildren()
    {
        $this->children = true;
    }

    /**
     * @param mixed $fields
     */
    public function setFields($fields)
    {
        $this->fields = $fields;
    }

    /**
     * @return mixed
     */
    public function getError()
    {
        return $this->error;
    }


    /**
     * @param mixed $id
     * @param mixed $fields
     * @return string
     */
    public function getFormChildren($id = null, $fields = null): string
    {
        $this->setChildren();
        return $this->getForm($id, $fields);
    }

    /**
     * @param mixed $id
     * @param mixed $fields
     */
    public function showFormChildren($id = null, $fields = null)
    {
        echo $this->getFormChildren($id, $fields);
    }

    /**
     * @param mixed $id
     * @param mixed $fields
     */
    public function showForm($id = null, $fields = null)
    {
        echo $this->getForm($id, $fields);
    }

    /**
     * @param mixed $id
     * @param mixed $fields
     * @return string
     */
    public function getForm($id = null, $fields = null): string
    {
        if ($id && is_array($id) && !$fields)
            return $this->getForm(null, $fields);

        $d = new Dicionario($this->entity);
        if ($fields && is_array($fields))
            $this->setFields($fields);

        if ($id && is_numeric($id))
            $d->setData($id);
        else
            $id = null;

        if (Entity::checkPermission($d->getEntity(), $id)) {
            $this->turnDicionarioIntoFormFormat($d);

            $form['inputs'] = $this->prepareInputs($d);
            $form['relevant'] = $d->getRelevant()->getColumn();
            $form['id'] = $id;
            $form['entity'] = $d->getEntity();
            $form['autoSave'] = $this->autoSave;
            $form['callback'] = $this->callback;
            $form['home'] = defined("HOME") ? HOME : "";
            $form['scripts'] = (!$this->children ? "<input type='hidden' id='fields-{$d->getEntity()}' value='" . ($this->fields ? json_encode($this->fields) : "") . "' />" : "");

            $template = new Template("form-crud");
            return $template->getShow("form", $form);
        }

        return "Permissão Negada";
    }

    private function turnDicionarioIntoFormFormat(Dicionario $d)
    {
        foreach ($d->getDicionario() as $meta) {
            if (!empty($meta->getSelect())) {
                $metaSelects = [];
                foreach ($meta->getSelect() as $select) {
                    $select = $d->search($select . "__" . $meta->getColumn());
                    $metaSelects[] = $select;
                    $d->removeMeta($select->getColumn());
                }
                $meta->setSelect($metaSelects);
            }
        }
    }

    /**
     * Processa todas as inputs do form uma a uma
     *
     * @param string $ngmodel
     * @return array
     */
    private function prepareInputs(Dicionario $d, string $ngmodel = "dados."): array
    {
        $listaInput = [];
        $template = new Template("form-crud");

        foreach ($d->getDicionario() as $i => $meta) {

            //pula algumas colunas pré-definidas
            if (!empty($d->search(0)) && !($d->getEntity() !== "usuarios" || (!empty($d->search(0)) && $_SESSION['userlogin']['id'] != $d->search(0))) && in_array($meta->getColumn(), ["status", "setor", "nivel"]))
                continue;

            //Se for ID ou se tem Form struct ou se Tem uma lista setada e a input esta nesta lista
            if ($meta->getKey() === "identifier" || (!$this->fields && $meta->getForm()['input']) || ($this->fields && in_array($meta->getColumn(), $this->fields))) {
                $input = $this->getBaseInput($d, $meta, $ngmodel);

                if ($meta->getKey() === "extend") {
                    $listaInput[] = $this->getExtentContent($meta, $input);
                } else {

                    if ($list = $this->checkListData($meta, $d))
                        $input = array_merge($input, $list);

                    $listaInput[] = "<div class='col {$input['s']} {$input['m']} {$input['l']} margin-bottom'>" .
                        $template->getShow($meta->getForm()['input'], $input) . '</div>';
                }
            }
        }

        return $listaInput;
    }

    /**
     * @param Dicionario $d
     * @param Meta $meta
     * @param string $ngmodel
     * @return array
     */
    private function getBaseInput(Dicionario $d, Meta $meta, string $ngmodel): array
    {
        $icon = "";
        $dr = "";
        if(in_array($meta->getKey(), ["extend_mult", "list_mult", "selecao_mult"])) {
            $dr = new Dicionario($meta->getRelation());
            $icon = $this->getIcons($dr->getRelevant()->getFormat());
        }

        return array_merge($meta->getDados(), [
            'path' => PATH_HOME,
            'home' => HOME,
            'icon' => $icon,
            'disabled' => preg_match('/disabled/i', $meta->getForm()['class']),
            'entity' => $d->getEntity(),
            'value' => $this->getValue($meta, $dr),
            'ngmodel' => $ngmodel . $meta->getColumn(),
            'form' => $meta->getForm(),
            's' => (!empty($meta->getForm()['cols']) ? 's' . $meta->getForm()['cols'] : ""),
            'm' => (!empty($meta->getForm()['colm']) ? 'm' . $meta->getForm()['colm'] : ""),
            'l' => (!empty($meta->getForm()['coll']) ? 'l' . $meta->getForm()['coll'] : "")
        ]);
    }

    /**
     * @param Meta $meta
     */
    private function getValue(Meta $meta, $dr)
    {
        $v = !empty($meta->getValue()) ? $meta->getValue() : $meta->getDefault();

        if (in_array($meta->getKey(), ["extend_mult", "list_mult", "selecao_mult"])) {
            if (!empty($v)) {
                $read = new Read();
                $data = [];
                foreach (json_decode($v, true) as $item) {
                    $read->exeRead($meta->getRelation(), "WHERE id = :id", "id={$item}");
                    if ($read->getResult())
                        $data[] = ["id" => $read->getResult()[0]['id'], "title" => $read->getResult()[0][$dr->getRelevant()->getColumn()]];
                }
                $v = $data;
            }
        } elseif($meta->getType() === "json") {
            $v = json_decode($v, true);
        } elseif ($meta->getFormat() === "datetime" && !empty($v)) {
            $v = str_replace(' ', 'T', $v);
        } elseif (is_numeric($v) && is_float($v)) {
            $v = (float)$v;
        } elseif (is_numeric($v)) {
            $v = (int)$v;
        } elseif (preg_match('/{\$/i', $v)) {
            $v = "";
        }

        return $v;
    }

    /**
     * @param Meta $meta
     * @param string $ngmodel
     * @return string
     */
    private function getExtentContent(Meta $meta, array $input): string
    {
        $dic = new Dicionario($meta->getRelation());
        if (!empty($meta->getValue()))
            $dic->setData($meta->getValue());

        $input["inputs"] = $this->prepareInputs($dic, $input['ngmodel'] . ".");

        $template = new Template("form-crud");
        return $template->getShow("extend", $input);
    }

    /**
     * @param Meta $meta
     * @param Dicionario $d
     * @return mixed
     */
    private function checkListData(Meta $meta, Dicionario $d)
    {

        if ($meta->getKey() === "list" || $meta->getKey() === "selecao") {
            if (!empty($meta->getValue())) {
                $dr = new Dicionario($meta->getRelation());
                $dr->setData($meta->getValue());

                return [
                    "title" => $dr->getRelevant()->getValue(),
                    "id" => $meta->getValue(),
                    "mult" => (!empty($meta->getSelect()) ? $this->checkSelecaoUnique($meta) : "")
                ];
            } else {
                return [
                    "title" => "",
                    "id" => "",
                    "mult" => (!empty($meta->getSelect()) ? $this->checkSelecaoUnique($meta) : "")
                ];
            }
        }

        return null;
    }

    /**
     * Busca por campos mult relacionais que precisam ser selecionados
     *
     * @param Meta $meta
     * @param Dicionario $dicionario
     * @return string
     */
    private
    function checkSelecaoUnique(Meta $meta): string
    {
        $mult = "";

        $tpl = new \Helpers\Template("form-crud");
        foreach ($meta->getSelect() as $select) {

            if (!empty($select->getValue())) {
                $dr = new Dicionario($select->getRelation());
                $dr->setData($select->getValue());
                $tplData = array_merge($select->getDados(), ["title" => $dr->getRelevant()->getValue(), "id" => $select->getValue()]);
            } else {
                $tplData = array_merge($select->getDados(), ["title" => "", "id" => ""]);
            }

            $tplData['nome'] = preg_match('/s$/i', $select->getNome()) ? substr($select->getNome(), 0, strlen($select->getNome()) - 1) : $select->getNome();
            $tplData['genero'] = preg_match('/a$/i', $select->getNome()) ? "a" : "o";
            $tplData['parentColumn'] = $meta->getColumn();
            $tplData['parentValue'] = $meta->getValue() ? 1 : "";
            $tplData['column'] = $select->getColumn();
            $tplData['ngmodel'] = "dados." . $select->getColumn();
            $tplData['entity'] = $meta->getRelation();

            $mult .= $tpl->getShow("selecaoUnique", $tplData);
        }

        return $mult;
    }

    private
    function getIcons($type)
    {
        switch ($type) {
            case 'email':
                return "email";
                break;
            case 'tel':
                return "settings_phone";
                break;
            case 'cep':
                return "location_on";
                break;
            case 'valor':
                return "attach_money";
                break;
            default:
                return "folder";
        }
    }
}