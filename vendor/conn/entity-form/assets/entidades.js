var entity = {};
var dicionarios = {};
var identifier = {};
var defaults = {};
var data = {
    "image": ["png", "jpg", "jpeg", "gif", "bmp", "tif", "tiff", "psd", "svg"],
    "video": ["mp4", "avi", "mkv", "mpeg", "flv", "wmv", "mov", "rmvb", "vob", "3gp", "mpg"],
    "audio": ["mp3", "aac", "ogg", "wma", "mid", "alac", "flac", "wav", "pcm", "aiff", "ac3"],
    "document": ["txt", "doc", "docx", "dot", "dotx", "dotm", "ppt", "pptx", "pps", "potm", "potx", "pdf", "xls", "xlsx", "xltx", "rtf"],
    "compact": ["rar", "zip", "tar", "7z"],
    "denveloper": ["html", "css", "scss", "js", "tpl", "json", "xml", "md", "sql", "dll"]
};

readDefaults();
readDicionarios();
entityReset();

function readDefaults() {
    post("entity-form", "load/defaults", function (data) {
        defaults = data;
    });
}

function readIdentifier() {
    post("entity-form", "load/identifier", function (data) {
        identifier = data;
    });
}

function readDicionarios() {
    readIdentifier();
    post("entity-form", "load/dicionarios", function (data) {
        dicionarios = data;
        $("#entity-space, #relation").html("");

        $.each(dicionarios, function (i, e) {
            copy("#tpl-entity", "#entity-space", i, true);
            $("#relation").append("<option value='" + i + "'>" + i + "</option>");
        });
    });
}

function entityReset() {
    entity = {
        "name": "",
        "edit": null
    };
}

function entityEdit(id) {
    if ((typeof(id) === "undefined" && entity.name !== "") || (typeof(id) !== "undefined" && id !== entity.name)) {
        saveEntity(true);
        entityReset();

        if (typeof(id) !== "undefined")
            entity.name = id;

        showEntity();
    } else {
        showImport();
        $("#entityName").focus();
    }
}

function showEntity() {
    $("#entityName").val(entity.name).focus();

    $("#entityAttr").html("");
    $.each(dicionarios[entity.name], function (i, column) {
        copy("#tpl-attrEntity", "#entityAttr", [i, column.column], true);
    });

    showImport();
}

function showImport() {
    if ($("#entityAttr").html() === "")
        $("#importForm").removeClass("hide");
    else
        $("#importForm").addClass("hide");
}

function saveEntity(silent) {
    if (checkSaveAttr() && entity.name.length > 2 && typeof(dicionarios[entity.name]) !== "undefined" && !$.isEmptyObject(dicionarios[entity.name])) {
        post("entity-form", "save/entity", {
            "name": entity.name,
            "dados": dicionarios[entity.name],
            "id": identifier[entity.name]
        }, function (g) {
            toast("Salvo");
            if (g && typeof(silent) === "undefined") {
                readDicionarios()
            }
        });
    }
}

function resetAttr(id) {
    entity.edit = typeof(id) !== "undefined" ? id : null;
    $(".selectInput").css("color", "#CCCCCC").val("");
    $("#format-source, #requireListExtend, #requireListFilter").addClass("hide");
    $("#allowBtnAdd, #spaceValueAllow").removeClass("hide");
    $("#spaceValueAllow, #requireListExtendDiv, #list-filter").html("");
    $(".file-format").each(function () {
        $(this).prop("checked", false);
        $("." + $(this).attr("id") + "-format").prop("checked", false);
    });
    if (entity.edit !== null)
        $(".selectInput, #relation").attr("disabled", "disabled").addClass("disabled");
    else
        $(".selectInput, #relation").removeAttr("disabled").removeClass("disabled");

    applyAttr(getDefaultsInfo());
}

function editAttr(id) {
    if (id !== entity.edit) {
        if (checkSaveAttr())
            resetAttr(id);
    }
}

function checkSaveAttr() {
    var yes = true;
    if (checkRequiresFields()) {
        if (entity.edit === null) {
            if (entity.name === "") {
                var temp = slug($("#entityName").val(), '_');
                $.each(dicionarios, function (nome, data) {
                    if (nome === temp) {
                        $("body").panel(themeNotify("Nome de Entidade já existe", "warning"));
                        yes = false;
                    }
                });
                if (yes && allowName(temp)) {
                    entity.name = temp;
                    identifier[entity.name] = 1;
                    dicionarios[entity.name] = {};
                }
            }
            if (yes) {
                entity.edit = identifier[entity.name];
                identifier[entity.name]++;
            }
        }
        if (yes) {
            saveAttrInputs();
            resetAttr();
            showEntity();
        }
    }
    return yes;
}

function saveAttrInputs() {
    dicionarios[entity.name][entity.edit] = assignObject(defaults.default, defaults[getType()]);

    $.each($(".input"), function () {
        if (!$(this).hasClass("hide"))
            saveAttrValue($(this));
    });

    dicionarios[entity.name][entity.edit]['allow']['values'] = [];
    dicionarios[entity.name][entity.edit]['allow']['names'] = [];

    checkSaveFilter();
    checkSaveSelect();

    if (dicionarios[entity.name][entity.edit]['format'] === "source" || dicionarios[entity.name][entity.edit]['format'] === "sources")
        checkSaveSource();
    else
        checkSaveAllow();
}

function checkSaveFilter() {
    if ($("#list-filter").html() !== "") {
        $("#list-filter").find(".filterTpl").each(function () {
            var $this = $(this);
            var filter = $this.find(".filter").val();
            var filter_column = $this.find(".filter_column").length > 0 ? $this.find(".filter_column").val() : null;
            var filter_operator = $this.find(".filter_operator").val();
            var filter_value = $this.find(".filter_value").val();

            if (filter !== "" && filter_operator !== "" && filter_value !== "")
                dicionarios[entity.name][entity.edit]['filter'].push(filter + "," + filter_operator + "," + filter_value + "," + filter_column);
        });
    }
}

function checkSaveSelect() {
    if ($("#requireListExtendDiv").html() !== "") {
        $("#requireListExtendDiv").find("input").each(function () {
            if ($(this).prop("checked"))
                dicionarios[entity.name][entity.edit]['select'].push($(this).attr("id"));
        });
    }
}

function checkSaveSource() {
    $(".file-format").each(function () {
        if ($(this).prop("checked")) {
            $("." + $(this).attr("id") + "-format").each(function () {
                if ($(this).prop("checked")) {
                    dicionarios[entity.name][entity.edit]['allow']['values'].push($(this).attr("id"));
                    dicionarios[entity.name][entity.edit]['allow']['names'].push($(this).attr("id"));
                }
            });
        }
    });
}

function checkSaveAllow() {
    if ($("#spaceValueAllow").html() !== "") {
        $.each($("#spaceValueAllow").find(".allow"), function () {
            saveAllowValue($(this));
        });
    }
}

function saveAttrValue($input) {
    var name = $input.attr("id");
    if (name === "nome")
        dicionarios[entity.name][entity.edit]['column'] = slug($input.val(), "_");

    if (["default", "size"].indexOf(name) > -1 && !$("#" + name + "_custom").prop("checked"))
        dicionarios[entity.name][entity.edit][name] = false;
    else if ("form" === name)
        dicionarios[entity.name][entity.edit][name] = $input.prop("checked") ? {} : false;
    else if (dicionarios[entity.name][entity.edit]['form'] !== false && ["class", "style", "coll", "cols", "colm", "input"].indexOf(name) > -1)
        dicionarios[entity.name][entity.edit]['form'][name] = $input.val();
    else if ("regex" === name)
        dicionarios[entity.name][entity.edit]['allow'][name] = $input.val();
    else
        dicionarios[entity.name][entity.edit][name] = ($input.attr("type") === "checkbox" ? $input.prop("checked") : $input.val());
}

function saveAllowValue($input) {
    if ($input.find(".values").val() !== "") {
        dicionarios[entity.name][entity.edit]['allow']['values'].push($input.find(".values").val());
        dicionarios[entity.name][entity.edit]['allow']['names'].push($input.find(".names").val());
    }
}

function applyAttr(data) {
    if (typeof (data) !== "undefined" && data !== null) {
        $.each(data, function (name, value) {
            if (typeof(value) === "object")
                applyAttr(value);

            applyValueAttr(name, value);
        });

        checkFieldsOpenOrClose();
    }
}

function applyValueAttr(name, value) {
    var $input = $("#" + name);

    if (name === "values" || name === "names") {
        setAllow(name, value);
    } else if (name === "filter") {
        $.each(value, function (i, e) {
            addFilter(e);
        });
    } else if (name === "select") {
        checkEntityMultipleFields(value);
    } else {
        if ($input.attr("type") === "checkbox" && ((value !== false && !$input.prop("checked")) || (value === false && $input.prop("checked"))))
            $input.trigger("click");
        else
            checkValuesEspAttr(name, value);
    }
}

function checkValuesEspAttr(name, value) {
    if ((name === "default" || name === "size")) {
        if ((value !== false && !$("#" + name + "_custom").prop("checked")) || (value === false && $("#" + name + "_custom").prop("checked"))) {
            $("#" + name + "_custom").trigger("click");
        }
        $("#" + name).val(value !== false ? value : "");
    } else if (name === "format") {
        setFormat(value);
    } else {
        $("#" + name).val(value);
    }
}

function setAllow(name, value) {
    if (name === "values" && entity.edit !== null && (dicionarios[entity.name][entity.edit]['format'] === "source" || dicionarios[entity.name][entity.edit]['format'] === "sources")) {
        $.each(value, function (i, e) {
            $.each(data, function (name, dados) {
                if (dados.indexOf(e) > -1 && !$("#" + name).prop("checked")) {
                    $("#" + name).prop("checked", true);
                    $("#formato-" + name).removeClass("hide");
                }
            });
            $("#" + e).prop("checked", true);
        });

    } else {
        var copia = $("#spaceValueAllow").html() === "";
        $.each(value, function (i, e) {
            if (copia) copy('#tplValueAllow', '#spaceValueAllow', '', 'append');
            var $allow = (copia ? $("#spaceValueAllow").find(".allow:last-child") : $("#spaceValueAllow").find(".allow:eq(" + i + ")"));
            $allow.find("." + name).val(e);
        });
    }
}

function setFormat(val) {
    $(".selectInput").css("color", "#CCCCCC").val("");
    getSelectInput(val).css("color", "#333333").val(val);

    if (val === "source" || val === "sources") {
        $("#format-source").removeClass("hide");
        $("#allowBtnAdd, #spaceValueAllow").addClass("hide");
    } else {
        $("#format-source").addClass("hide");
        $("#allowBtnAdd, #spaceValueAllow").removeClass("hide");

        if (["extend", "extend_mult", "list", "list_mult", "selecao", "selecao_mult"].indexOf(val) > -1)
            $("#relation_container").removeClass("hide");
        else
            $("#relation_container").addClass("hide");
    }

    $(".requireName, #nomeAttr").removeClass("hide");
    $("#nome").focus();
}

function getSelectInput(val) {
    if (["text", "textarea", "html", "int", "float", "boolean", "select", "radio", "checkbox", "range", "color", "source", "sources"].indexOf(val) > -1)
        return $("#funcaoPrimary");
    else if (["extend", "extend_mult", "list", "list_mult", "selecao", "selecao_mult", "publisher"].indexOf(val) > -1)
        return $("#funcaoRelation");
    else
        return $("#funcaoIdentifier");
}

function checkRequiresFields() {
    var type = getType();
    return (type !== "" && $("#nome").val().length > 1 && $("#nome").val() !== "id" && (["extend", "extend_mult", "list", "list_mult", "selecao", "selecao_mult"].indexOf(type) < 0 || $("#relation").val() !== null));
}

function checkFieldsOpenOrClose(nome) {
    if (allowName(nome)) {
        if (checkRequiresFields())
            $(".requireName").removeClass("hide");
        else
            $(".requireName").addClass("hide");

        if (["list", "list_mult", "selecao", "selecao_mult"].indexOf(getType()) > -1)
            $("#requireListFilter").removeClass("hide");
        else
            $("#requireListFilter").addClass("hide");
    }
}

function allowName(nome) {
    if (["add", "all", "alter", "analyze", "and", "as", "asc", "asensitive", "before", "between", "bigint", "binary", "blob", "both", "by", "call", "cascade", "case", "change", "char", "character", "check", "collate", "column", "condition", "connection", "constraint", "continue", "convert", "create", "cross", "current_date", "current_time", "current_timestamp", "current_user", "cursor", "database", "databases", "day_hour", "day_microsecond", "day_minute", "day_second", "dec", "decimal", "declare", "default", "delayed", "delete", "desc", "describe", "deterministic", "distinct", "distinctrow", "div", "double", "drop", "dual", "each", "else", "elseif", "enclosed", "escaped", "exists", "exit", "explain", "false", "fetch", "float", "for", "force", "foreign", "from", "fulltext", "goto", "grant", "group", "having", "high_priority", "hour_microsecond", "hour_minute", "hour_second", "if", "ignore", "in", "index", "infile", "inner", "inout", "insensitive", "insert", "int", "integer", "interval", "into", "is", "iterate", "join", "key", "keys", "kill", "leading", "leave", "left", "like", "limit", "lines", "load", "localtime", "localtimestamp", "lock", "long", "longblob", "longtext", "loop", "low_priority", "match", "mediumblob", "mediumint", "mediumtext", "middleint", "minute_microsecond", "minute_second", "mod", "modifies", "natural", "not", "no_write_to_binlog", "null", "numeric", "on", "optimize", "option", "optionally", "or", "order", "out", "outer", "outfile", "precision", "primary", "procedure", "purge", "read", "reads", "real", "references", "regexp", "rename", "repeat", "replace", "require", "restrict", "return", "revoke", "right", "rlike", "schema", "schemas", "second_microsecond", "select", "sensitive", "separator", "set", "show", "smallint", "soname", "spatia", "specific", "sql", "sqlexception", "sqlstate", "sqlwarning", "sql_big_result", "sql_calc_found_rows", "sql_small_result", "ssl", "starting", "straight_join", "table", "terminated", "then", "tinyblob", "tinyint", "tinytext", "to", "trailing", "trigger", "true", "undo", "union", "unique", "unlock", "unsigned", "update", "usage", "use", "using", "utc_date", "utc_time", "utc_timestamp", "values", "varbinary", "varchar", "varcharacter", "varying", "when", "where", "while", "with", "write", "xor", "year_month", "zerofill"].indexOf(nome) > 0) {
        $("body").panel(themeNotify("Este nome é reservado pelo sistema", "error"));
        $(".requireName").addClass("hide");
        return false;
    }
    return true;
}

function deleteAttr(id) {
    delete dicionarios[entity.name][id];
    showEntity();
}

function removeEntity(entity) {
    if (confirm("Excluir esta entidade e todos os seus dados?")) {
        post("entity-form", "delete/entity", {"name": entity}, function (g) {
            if (g) {
                $("body").panel(themeNotify("Entidade Excluída", "warning"));
                readDicionarios();
            }
        })
    }
}

function sendImport() {
    if ($("#import").val() !== "") {
        var form_data = new FormData();
        form_data.append('file', $('#import').prop('files')[0]);
        $.ajax({
            url: HOME + 'entidadesImport',
            dataType: 'text',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            type: 'post',
            success: function (data) {
                if (data) {
                    if (data === "existe") {
                        toast("Entidade já Existe", "warning", 2500);
                    } else {
                        toast("Rejeitado! Chave Estrangeira Ausente", "warning", 4000);
                        post('entity-form', 'delete/import', {entity: $('#import').val()}, function (g) {
                        });
                    }
                    $('#import').val("");
                } else {
                    location.reload();
                }
            }
        });
    }
}

function addFilter(value) {
    var field = "";
    var operator = "";
    var valor = "";
    var column = "null";
    if (typeof (value) !== "undefined") {
        var e = value.split(",");
        field = e[0];
        operator = e[1];
        valor = e[2];
        column = e[3];
    }

    //Copia Cria o Filter
    copy("#tpl-list-filter", "#list-filter", {0: operator, 1: valor}, "append");
    var id = Math.floor(Math.random() * 1000000);
    var $filter = $(".filter").last().attr("id", id).html("");
    var relation = "null";

    //Adiciona as opções de entidade
    $.each(dicionarios[$("#relation").val()], function (i, e) {
        copy("#optionTpl", "#" + id, {
            0: e.column,
            1: e.nome,
            2: (field === e.column ? "\" selected=\"selected" : "")
        }, "append");

        if (field === e.column && ["list", "list_mult", "selecao", "selecao_mult", "extend", "extend_mult"].indexOf(e.key) > -1)
            relation = e.relation
    });

    //Adiciona as opções de coluna da entidade
    if (column !== "null" && relation !== "null")
        addColumnFilter($filter, relation, column);
}

function checkFilterToApply() {
    if (["list", "list_mult", "selecao", "selecao_mult"].indexOf($("#funcaoRelation").val()) > -1) {
        $("#requireListFilter").removeClass("hide");
        $("#list-filter").html("");
        addFilter();
    } else {
        $("#requireListFilter").addClass("hide");
    }
}

function checkEntityMultipleFields(values) {
    $("#requireListExtend").addClass("hide");
    $("#requireListExtendDiv").html("");
    $.each(dicionarios[$("#relation").val()], function (i, e) {
        if (e.key === "selecao_mult" || e.key === "list_mult" || e.key === "extend_mult") {
            var checked = typeof (values) !== "undefined" && $.inArray(e.column, values) > -1 ? '" checked="checked' : '';
            copy("#selectOneListOption", "#requireListExtendDiv", {0: e.column, 1: e.nome, 2: checked}, "append");
            $("#requireListExtend").removeClass("hide");
        }
    });
}

/*

SLIDE

function changeLeftRange($this) {
    var value = Math.pow(2, parseInt($this.val()));
    var left = ((((parseInt($this.val()) * 100) / parseInt($this.attr("max"))) * ($this.width() - 27)) / 100);
    left += (value < 10 ? 9 : (value < 100 ? 5 : (value < 1000 ? 1 : (value < 10000 ? -3 : (value < 100000 ? -7 : (value < 1000000 ? -11 : -15))))));
    $this.siblings(".tempRangeInfo").css("left", left + "px").text(value);
}

*/

$("input[type=range]").mousedown(function () {
    changeLeftRange($(this));
    $(this).mousemove(function () {
        changeLeftRange($(this));
    });
}).mouseup(function () {
    $(this).off("mousemove");
}).change(function () {
    changeLeftRange($(this));
});

/* EVENTS */

$("#entityName").on("keyup change focus", function () {
    if ($(this).val().length > 2)
        $("#requireNameEntity").removeClass("hide");
    else
        $("#requireNameEntity").addClass("hide");
});

$("#relation").change(function () {
    checkFieldsOpenOrClose();
    checkEntityMultipleFields();
    checkFilterToApply();
});

$(".selectInput").change(function () {
    setFormat($(this).val());
    applyAttr(assignObject(defaults.default, defaults[getType()]));
    checkFieldsOpenOrClose();
});

$("#nome").on("keyup change", function () {
    checkFieldsOpenOrClose($(this).val());
});

$("#default_custom").change(function () {
    if ($(this).is(":checked")) {
        $("#default_container").removeClass("hide");
        $("#default").focus();
        if ($("#unique").is(":checked"))
            $("#unique").trigger("click");
    } else {
        $("#default_container").addClass("hide");
    }
});

$("#size_custom").change(function () {
    if ($(this).is(":checked")) {
        $("#size_container").removeClass("hide");
        $("#size").focus();
    } else {
        $("#size_container").addClass("hide");
    }
});

$("#unique").change(function () {
    if ($(this).is(":checked") && $("#default_custom").is(":checked")) $("#default_custom").trigger("click");
});

$("#form").change(function () {
    if ($(this).is(":checked"))
        $(".form_body").removeClass("hide");
    else
        $(".form_body").addClass("hide");
});

$(".file-format").change(function () {
    if ($(this).is(":checked"))
        $("#formato-" + $(this).attr("id")).removeClass("hide");
    else
        $("#formato-" + $(this).attr("id")).addClass("hide");
}).click(function () {
    var $this = $(this);
    setTimeout(function () {
        if ($this.prop("checked") && !$("#all-" + $this.attr("id")).prop("checked"))
            $("#all-" + $this.attr("id")).trigger("click");
    }, 50);
});

$(".allformat").change(function () {
    $("." + $(this).attr("rel") + "-format").prop("checked", $(this).is(":checked"));
});

$(".oneformat").change(function () {
    if (!$(this).is(":checked")) {
        $("#all-" + $(this).attr("rel")).prop("checked", false);
    } else {
        var all = true;
        $.each($("." + $(this).attr("rel") + "-format"), function () {
            if (all && !$(this).is(":checked"))
                all = false;
        });
        $("#all-" + $(this).attr("rel")).prop("checked", all);
    }
});

$("#colm").change(function () {
    var $coll = $("#coll");
    var $cols = $("#cols");
    var value = parseInt($(this).val());
    if (parseInt($coll.val()) > value) {
        $coll.find("option").removeAttr("selected");
        $coll.find("option[value=" + $(this).val() + "]").attr("selected", "selected");
    }
    if (parseInt($cols.val()) < value) {
        $cols.find("option").removeAttr("selected");
        $cols.find("option[value=" + $(this).val() + "]").attr("selected", "selected");
    }
});

$("#requireListFilter").off("change", ".filter").on("change", ".filter", function () {
    var $this = $(this);
    var dic = null;
    var column = $this.val();
    var entity = $("#relation").val();

    $this.removeClass("m3").addClass("m6").siblings(".filter_column").remove();
    $.each(dicionarios[entity], function (i, e) {
        if (e.column === column) {
            if (["extend", "extend_mult", "list", "list_mult", "selecao", "selecao_mult"].indexOf(e.key) > -1)
                addColumnFilter($this, e.relation, "");
            return false;
        }
    });

});

function addColumnFilter($this, entity, select) {
    $this.removeClass("m6").addClass("m3");
    var $column = $('<select class="filter_column col s12 m3"></select>').insertAfter($this);
    $.each(dicionarios[entity], function (id, data) {
        if (["extend", "extend_mult", "list", "list_mult", "selecao", "selecao_mult"].indexOf(data.key) < 0)
            $column.append("<option value='" + data.column + "' " + (select === data.column ? "selected='selected'" : "") + ">" + data.nome + "</option>");
    });
}

function getDefaultsInfo() {
    var type = getType();

    if (entity.edit !== null)
        return assignObject(defaults.default, dicionarios[entity.name][entity.edit]);
    else if (type !== "")
        return assignObject(defaults.default, defaults[getType()]);
    else
        return assignObject(defaults.default, {});
}

function assignObject(ob1, ob2) {
    var t = typeof(ob1) === "object" ? JSON.parse(JSON.stringify(ob1)) : {};
    $.each(ob2, function (name, value) {
        if (typeof(value) === "object")
            t[name] = assignObject(t[name], value);
        else
            t[name] = value;
    });
    return t;
}

function getType() {
    var result = "";
    $(".selectInput").each(function () {
        if ($(this).val() !== null)
            result = $(this).val();
    });
    return result;
}