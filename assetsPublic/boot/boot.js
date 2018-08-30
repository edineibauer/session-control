
/* seta plugins */
function plugin() {
    $(".plugin").each(function () {
        var $this = $(this);
        $this.attr("data-plugin").trim().split(' ').forEach(function (plug) {
            $this[plug.trim()]();
        });
    });
}

/* Post request com retorno em JSON e tratamento de resposta */
function post(lib, file, param, funcao, dev) {
    if(typeof (funcao) === "undefined") {
        funcao = param;
        param = {};
    }
    param['lib'] = lib;
    param['file'] = file;

    $.ajax({
        type: "POST",
        url: HOME + 'request/post',
        data: param,
        success: function (data) {
            if(typeof (dev) !== "undefined") {
                console.log(data);
                data = $.parseJSON(data);
            }
            switch (data.response) {
                case 1:
                    funcao(data.data);
                    break;
                case 2:
                    $("body").panel(themeNotify(data.error, "warning", 3000));
                    break;
                default:
                    $("body").panel(themeNotify("Erro Desconhecido", "erro"));
            }
        },
        dataType: (typeof (dev) !== "undefined" ? "html" : "json")
    });
}

function tplObject(obj, $elem, prefix) {
    prefix = typeof (prefix) === "undefined" ? "" : prefix;
    if (typeof (obj) === "object") {
        $.each(obj, function (key, value) {
            if (obj instanceof Array) $elem = tplObject(value, $elem, prefix + key);
            else $elem = typeof (value) === "object" ? tplObject(value, $elem, prefix + key + ".") : $elem.replace(regexTpl(prefix + key), value);
        });
    } else {
        $elem = $elem.replace(regexTpl(prefix), obj);
    }

    return $elem;
}

/* Clona elementos */
function copy($elem, $destino, variable, position) {
    $elem = (typeof ($elem) === "string" ? $($elem) : $elem);
    $destino = (typeof ($destino) === "string" ? $($destino) : $destino);

    $elem = $elem.clone().removeClass("hide").removeAttr("id").prop('outerHTML');
    $elem = tplObject(variable, $elem);
    if (typeof (position) === "undefined") $($elem).prependTo($destino);
    else if (position === "after") $($elem).insertAfter($destino);
    else if (position === "before") $($elem).insertBefore($destino);
    else $($elem).appendTo($destino);
}

function regexTpl(v) {
    return new RegExp('__\\s*\\$' + v + '\\s*__', 'g');
}

/* Cria slug names */
function slug(val, replaceBy) {
    replaceBy = replaceBy || '-';
    var mapaAcentosHex 	= { // by @marioluan and @lelotnk
        a : /[\xE0-\xE6]/g,
        A : /[\xC0-\xC6]/g,
        e : /[\xE8-\xEB]/g, // if you're gonna echo this
        E : /[\xC8-\xCB]/g, // JS code through PHP, do
        i : /[\xEC-\xEF]/g, // not forget to escape these
        I : /[\xCC-\xCF]/g, // backslashes (\), by repeating
        o : /[\xF2-\xF6]/g, // them (\\)
        O : /[\xD2-\xD6]/g,
        u : /[\xF9-\xFC]/g,
        U : /[\xD9-\xDC]/g,
        c : /\xE7/g,
        C : /\xC7/g,
        n : /\xF1/g,
        N : /\xD1/g,
    };

    for ( var letra in mapaAcentosHex ) {
        var expressaoRegular = mapaAcentosHex[letra];
        val = val.replace( expressaoRegular, letra );
    }

    val = val.toLowerCase();
    val = val.replace(/[^a-z0-9\-]/g, " ");

    val = val.replace(/ {2,}/g, " ");

    val = val.trim();
    val = val.replace(/\s/g, replaceBy);

    return val;
}

function contain(t, e) {
    var n;
    for (n = 0; n < e.length; n++) if (e[n] === t) return n;
    return -1
}

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Array.prototype.removeItem = function(name) {
    if($.inArray(name, this) > -1) {
        this.splice($.inArray(name, this), 1);
    }
    return $.grep( this , function () {
        return true;
    });
};

$(function ($) {
    $.fn.loading = function () {
        this.find(".loading").remove();
        this.prepend('<ul class="loading"><li class="fl-left one"></li><li class="fl-left two"></li><li class="fl-left three"></li></ul>');
        return this;
    };
}(jQuery));

$(function () {
    $("form").submit(function (e) {
        e.preventDefault();
    });
    plugin();
});