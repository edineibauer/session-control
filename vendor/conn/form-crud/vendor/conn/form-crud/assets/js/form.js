$(function ($) {
    $.fn.loading = function () {
        this.siblings(".loading").remove();
        this.after('<ul class="loading"><li class="fl-left one"></li><li class="fl-left two"></li><li class="fl-left three"></li></ul>');
    };

    var $form = $("form").last();

    var dados = {
        entity: $form.attr("data-table") || $form.attr("data-entity") || "null",
        dados: {}
    };
    var limitList = 10;
    var saveTime, keyupTime;

    if (dados.entity === "null") {
        alert("método form necessita de 'data-table' para chamar uma função para o form.");

    } else {
        var form = {
            setDados: function ($this, value) {
                if (typeof($this.attr("data-model")) !== "undefined") {

                    $this.removeClass("subErro").siblings('.error-span').remove();

                    var $form = $this.parents("form").first();
                    var id = $form.find("#formcrud-identificador-entity").val();
                    var entity = $form.attr("data-table");

                    if (!isNaN(id) && id > 0) {
                        if ($this.hasClass("autocomplete-mult")) form.createAssociation(entity, id, $this.attr("data-entity"), value);
                        else form.update(entity, id, $this.attr("data-model"), value);
                    } else {
                        dados = addDados(dados, $this.attr("data-model"), value);
                        form.save(entity, dados);
                    }
                }
            },
            slidNave: function ($this, title, button) {
                var id = $this.attr("data-entity") + "-" + Math.floor((Math.random() * 1000000));
                button.panel({
                    header: {
                        html: title,
                        class: "color-indigo"
                    },
                    id: id,
                    css: {
                        width: 550,
                        left: 'center'
                    },
                    body: {
                        ajax: {
                            param: {
                                lib: 'form-crud',
                                file: 'formCrud',
                                entity: $this.attr("data-entity"),
                                title: title
                            }
                        }
                    },
                    control: {
                        onClose: function () {
                            form.save();
                        },
                        onMinimize: function () {
                            form.save();
                        }
                    }
                });
            },
            gallery: function ($this) {
                $this.panel({
                    header: {
                        html: 'Galeria',
                        class: "color-indigo"
                    },
                    css: {
                        width: 700,
                        left: 'center'
                    },
                    body: {
                        ajax: {
                            param: {
                                lib: 'form-crud',
                                file: 'gallery',
                                folder: $this.attr("data-folder")
                            }
                        }
                    },
                    control: {
                        onClose: function () {
                            if (sessionStorage.getItem("gallery-image") && sessionStorage.getItem("gallery-image").length > 0) {
                                var value = sessionStorage.getItem("gallery-image");
                                sessionStorage.removeItem("gallery-image");
                                $this.parent().parent().parent().find("img").attr("src", value);
                                var $input = $this.siblings("input[type=hidden]");
                                $input.val(value);
                                form.fireChange($input, value);
                            }
                        }
                    }
                });
            },
            getListData: function ($this) {
                $.post(HOME + 'request/post', {
                    lib: 'form-crud',
                    file: 'getListData',
                    limit: limitList,
                    entity: $this.attr("data-entity"),
                    search: $this.val()
                }, function (g) {

                    if (g.response === 1) {
                        setTimeout(function () {
                            $(".openList").remove();
                            setOpenList($form, $this, g.data);
                            if ($this.hasClass("autocomplete")) {

                                $this.parent().parent().find("i").text("add");

                                $("body").off("mousedown", ".openList ul li").on("mousedown", ".openList ul li", function () {
                                    $this.parent().parent().find("i").text("edit");
                                    $this.val($(this).text());
                                    form.setDados($this, g.data[$(this).text()]);
                                });

                                if ($this.val() in g.data) {
                                    $this.parent().parent().find("i").text("edit");
                                    form.setDados($this, g.data[$this.val()]);
                                }

                            } else {
                                $("body").off("mousedown", ".openList ul li").on("mousedown", ".openList ul li", function () {
                                    form.createChip($this, $(this).text())
                                });
                            }
                        }, 101);
                    } else {
                        $(".openList").remove();
                        setErro(g.error);
                    }
                }, 'json');
            },
            autocompleteNav: function ($this, action) {
                var $list = $("#list-" + $this.attr("data-entity")).find(".active");
                if (action === 40 && $list.next("li").length) $list.removeClass("active").next("li").addClass("active");
                else if ($list.prev("li").length) $list.removeClass("active").prev("li").addClass("active");
            },
            autocompleteSelect: function ($this) {
                var $list = $("#list-" + $this.attr("data-entity"));
                if ($list.length) {
                    if ($this.hasClass("autocomplete-mult")) {
                        form.createChip($this, $list.find(".active").text());
                    } else {
                        $this.parent().parent().find("i").text("edit");
                        $this.val($list.find(".active").text());
                        form.setDados($this, $list.find(".active").attr("data-id"));
                    }
                    $list.remove();
                } else {
                    if ($this.hasClass("autocomplete-mult")) {
                        form.createChip($this, $this.val());
                    } else {
                        $this.parent().parent().find("i").text("edit");
                        form.setDados($this, $this.val());
                    }
                }
            },
            createChip: function ($this, text) {
                var $chip = $("<div class='col chip z-depth-2'>" +
                    "<div class='chip-text'>" + text + "</div>" +
                    "<i class='material-icons pointer removeChip'>clear</i>" +
                    "</div>");
                $this.val("");
                var add = 1;
                $.each($this.parent().parent().find(".chip-text"), function () {
                    if ($(this).text() === text) add = 0;
                });
                if (add === 1 && text !== "") form.addChip($this, $chip, text);
            },
            addChip: function ($this, $chip, text) {
                $this.parent().before($chip);
                form.setDados($this, text);
            },
            fireChange: function ($this, value) {
                clearTimeout(keyupTime);
                $(window).off("mousemove beforeunload");
                form.setDados($this, value);
            },
            get: function (entity, id) {
                $.post(HOME + 'request/post', {
                    lib: 'form-crud',
                    file: 'getEntity',
                    entity: entity,
                    id: id
                }, function (data) {
                    if (data.response === 1) {
                        dados = data.data;
                    } else {
                        setErro(data.data);
                    }
                }, 'json');
            },
            createAssociation: function (entity, id, entityField, value) {
                $.post(HOME + 'request/post', {
                    lib: 'form-crud',
                    file: 'associationCreate',
                    entity: entity,
                    id: id,
                    entityField: entityField,
                    value: value
                }, function (data) {
                    if (data.response === 0) {
                        setErro(data.error);
                    }
                }, 'json');
            },
            deleteAssociation: function (entity, id, entityField, value) {
                $.post(HOME + 'request/post', {
                    lib: 'form-crud',
                    file: 'associationDelete',
                    entity: entity,
                    id: id,
                    entityField: entityField,
                    value: value
                }, function (data) {
                    if (data.response === 0) {
                        setErro(data.error);
                    }
                }, 'json');
            },
            update: function (entity, id, field, value) {
                $.post(HOME + 'request/post', {
                    lib: 'form-crud',
                    file: 'updateEntity',
                    entity: entity,
                    id: id,
                    field: field,
                    value: value
                }, function (data) {
                    console.log(data);
                    if (data.response === 0) {
                        setErro(data.error);
                    }
                }, 'json');
            },
            save: function (entity, dados) {
                clearTimeout(saveTime);
                saveTime = setTimeout(function () {

                    console.log('save');
                    $.post(HOME + 'request/post', {
                        lib: 'form-crud',
                        file: 'saveDadosEntity',
                        entity: entity,
                        dados: dados['dados']
                    }, function (data) {
                        if (data.response === 0) {
                            setErro(data['error']);

                        } else if (data['response'] === 1) {
                            /*
                            sessionStorage.slideNaveReturnId = data['id'];
                            sessionStorage.slideNaveReturnTitle = data['title'];
                            dados['dados'] = {};
                            $("#form_" + dados['entity']).find("input, textarea").val("");
                            $("#form_" + dados['entity']).find("select").val($("#form_" + dados['entity']).find("select").find("option").first().val());
                            $("#form_" + dados['entity']).find("input[type=checkbox]").prop("checked", false);
                            $("#form_" + dados['entity']).find(".chips-autocomplete").attr("data-value", "").html("");
                            $('select').material_select();
                            form.update($("#form_" + dados['entity']));
                            $("#form_" + dados['entity']).siblings(".closebtnEdit").find("button").sideNav('hide');
                            */
                        }
                    }, "json");
                }, 400);
            }

        };

        $form.off("click", "button, input[type=submit]").on("click", "button, input[type=submit]", function (e) {
            e.preventDefault();

        }).off("focus", "select, input, textarea").on("focus", "select, input, textarea", function () {
            var $this = $(this);
            $this.off("keydown").on("keydown", function (e) {
                if (e.which === 13) { // Se for enter
                    e.preventDefault();

                    if ($this.hasClass("autocomplete") || $this.hasClass("autocomplete-mult")) form.autocompleteSelect($this);

                } else if (e.which !== 9) { // Diferente de tab
                    $this.off("keyup").on("keyup", function () {

                        if ($this.hasClass("autocomplete")) {
                            if (e.which !== 38 && e.which !== 40) form.getListData($this);
                            else form.autocompleteNav($this, e.which);

                        } else if ($this.hasClass("autocomplete-mult")) {
                            if (e.which !== 38 && e.which !== 40) form.getListData($this);
                            else form.autocompleteNav($this, e.which);

                        } else {

                            //seta ações de save
                            $(window).off("beforeunload").on("beforeunload", function () {
                                form.fireChange($this, $this.val());
                                return null;
                            }).off("mousemove").on("mousemove", function () {
                                form.fireChange($this, $this.val());
                            });

                            //Tempo para disparo do save automático
                            clearTimeout(keyupTime);
                            keyupTime = setTimeout(function () {
                                form.fireChange($this, $this.val());
                            }, 600);
                        }
                    });
                }

            });

            if ($this.hasClass("autocomplete")) form.getListData($this);
            else if ($this.hasClass("autocomplete-mult")) form.getListData($this);

        }).off("change", "input[type=checkbox]").on("change", "input[type=checkbox]", function () {
            form.fireChange($(this), $(this).is(":checked"));

        }).off("blur", ".autocomplete, .autocomplete-mult").on("blur", ".autocomplete, .autocomplete-mult", function () {
            setTimeout(function () {
                $(".openList").remove();
            }, 100);

        }).off("click", ".editList").on("click", ".editList", function () {
            var $input = $(this).parent().parent().find("input[type=text]");
            form.slidNave($input, $input.val(), $(this));

            //Edita Lista Multiplas
        }).off("click", ".chip-text").on("click", ".chip-text", function () {
            var $input = $(this).parent().parent().find("input");
            form.slidNave($input, $(this).text(), $(this));

        }).off("click", ".removeChip").on("click", ".removeChip", function () {
            var $chip = $(this).siblings(".chip-text");
            var $input = $chip.parent().parent().find("input");
            $chip.parent().remove();
            var $form = $input.parents("form").first();
            form.deleteAssociation($form.attr("data-table"), $form.find("#formcrud-identificador-entity").val(), $input.attr("data-entity"), $chip.text());

        }).off("mousedown", ".uploadImage").on("mousedown", ".uploadImage", function () {
            form.gallery($(this));
        });
    }

    function addDados(dados, model, value) {
        var part = model.split(".");
        if (part.length === 2) {
            dados[part[0]][part[1]] = value;
        } else if (part.length === 3) {
            if (typeof (dados[part[0]][part[1]]) === "undefined") dados[part[0]][part[1]] = {};
            dados[part[0]][part[1]][part[2]] = value;
        } else if (part.length === 4) {
            if (typeof (dados[part[0]][part[1]][part[2]]) === "undefined") dados[part[0]][part[1]][part[2]] = {};
            dados[part[0]][part[1]][part[2]][part[3]] = value;
        } else if (part.length === 5) {
            if (typeof (dados[part[0]][part[1]][part[2]][part[3]]) === "undefined") dados[part[0]][part[1]][part[2]][part[3]] = {};
            dados[part[0]][part[1]][part[2]][part[3]][part[4]] = value;
        } else if (part.length === 6) {
            if (typeof (dados[part[0]][part[1]][part[2]][part[3]][part[4]]) === "undefined") dados[part[0]][part[1]][part[2]][part[3]][part[4]] = {};
            dados[part[0]][part[1]][part[2]][part[3]][part[4]][part[5]] = value;
        }

        return dados;
    }

    function setOpenList($form, $this, data) {
        var top = $this.offset().top + $this.height() - $form.offset().top;
        var left = $this.offset().left - $form.offset().left;
        var $list = $("<div class='section z-depth-2 openList' id='list-" + $this.attr("data-entity") + "' style='width:" + $this.width() + "px;top: " + top + "px;left:" + left + "px'></div>").appendTo($form);
        var content = "<ul>";
        $.each(data, function (i, e) {
            content += "<li data-id='" + e + "' " + (content === "<ul>" ? "class='active'" : "") + ">" + i + "</li>";
        });

        $list.html(content + "</ul>");
    }

    function setErro(erro) {
        $.each(erro, function (column, mensagem) {
            console.log(column + ": " + mensagem);
            var $inputs = $("input[data-model='dados." + column + "'], select[data-model='dados." + column + "'], textarea[data-model='dados." + column + "']");
            $inputs.siblings('.error-span').remove();
            $inputs.addClass("subErro").parent().append('<span class="error-span" style="margin-top: -18px;float: left;font-size: 12px;height: 1px;color: red;">' + mensagem + '</span>');
        });
    }
});