const wwt = parseInt($(window).width());
const wht = parseInt($(window).height());

$(function ($) {

    $.fn.panel = function (options) {
        var panel = {
            id: options.id || Math.floor((Math.random() * 10000000)),
            drag: function ($ontab, $drag) {
                dragResizeAction($ontab, $drag, 'd', control.resize, control.onResize, control.onDrag);
            },
            minimize: function ($panel) {
                if ($panel.attr("data-minimize") === "1") {
                    minimizePanelOut($panel, control.speed, control.blur, control.resize, control.onResize, control.onDrag);

                } else {

                    minimizePanelIn($panel, control.speed, control.blur);
                    setTimeout(function () {
                        $panel.find(".ontab-header").off("mousedown").on("click", function () {
                            panel.minimize($panel);
                        });
                    }, control.speed * 1000);
                }
            },
            maximize: function ($panel) {
                if ($panel.attr("data-maximize") === "1") maximizePanelOut($panel, control.speed, control.resize, control.onResize, control.onDrag);
                else maximizePanelIn($panel, control.speed, control.resize);
                panelScrool(control.blur);
            }
        };

        var control = {
            drag: true,
            resize: true,
            minimize: true,
            maximize: true,
            close: true,
            onClose: false,
            onMinimize: false,
            onMaximize: false,
            onDrag: false,
            onResize: false,
            speed: 0.25,
            blur: true,
            clickOut: false,
            timeOut: false,
            closeFunction: false
        };
        $.extend(control, options.control);

        var css = {
            "top": parseInt(wht * (wwt < 900 ? (wwt < 500 ? 0 : 0.025) : 0.05)),
            "left": parseInt(wwt * (wwt < 900 ? (wwt < 500 ? 0 : 0.075) : 0.15)),
            "width": parseInt(wwt * (wwt < 900 ? (wwt < 500 ? 1 : 0.85) : 0.7)),
            "height": parseInt(wht * (wwt < 900 ? (wwt < 500 ? 1 : 0.95) : 0.9)),
            "z-index": 1,
            "transition-duration": control.speed * 1.3 + "s",
            "border-radius": 0,
            "min-width": 190,
            "max-width": wwt,
            "min-height": 30,
            "max-height": wht
        };
        $.extend(css, options.css);
        css = processaCss(css);

        var attr = {
            "data-drag": control.drag === true ? 1 : 0,
            "data-top": css.top,
            "data-left": css.left,
            "data-width": css.width,
            "data-height": css.height
        };
        if (control.minimize) attr['data-minimize'] = 0;
        if (control.maximize) attr['data-maximize'] = 0;
        $.extend(attr, options.attr);
        attr.id = panel.id;

        var header = {
            html: "",
            css: {
                padding: 0
            },
            class: ""
        };
        $.extend(header, options.header);
        header.css = processaCss(header.css);

        var body = {
            html: '',
            ajax: {
                src: (typeof HOME !== 'undefined' ? HOME : "./") + "request/post"
            },
            css: {
                padding: 0,
                height: parseInt(css.height) - (control.resize ? 45 : 30)
            }
        };
        body = $.extend(true, {}, body, options.body);
        body.css = processaCss(body.css);

        var $ontab = $("<div />").attr(attr).addClass("ontab").css({
            "left": options.target ? getCenterLeftTarget(options.target) : getCenterLeftTarget(this),
            "top": options.target ? getCenterTopTarget(options.target) : getCenterTopTarget(this)
        }).appendTo("body");

        setTimeout(function () {
            $ontab.css(css);
        }, 1);

        var $drag = $("<div />").addClass("ontab-header").addClass(header.class).css(header.css).prependTo($ontab);
        $("<div />").addClass("title").text(header.html).css("background", $drag.css("background")).prependTo($drag);
        var $body = $("<div />").addClass("ontab-content").css(body.css).html(body.html).prependTo($ontab);

        if (typeof(body.ajax.param) !== 'undefined' || body.ajax.src !== (typeof HOME !== 'undefined' ? HOME : "./") + "request/post") {
            ajaxLoad($body, body.ajax.src, body.ajax.param, body.ajax.done).appendTo($body);
        }

        if (control.minimize) {
            var $mini = $("<div />").addClass("ontab-button btn-ontab-mini").attr("title", "minimizar").text("-").prependTo($drag);
            $mini.on("click", function () {
                if (control.onMinimize) {
                    if (!control.onMinimize()) {
                        panel.minimize($ontab);
                    }
                } else {
                    panel.minimize($ontab);
                }
            });
        }
        if (control.maximize) {
            var $maxi = $("<div />").addClass("ontab-button btn-ontab-maxi").attr("title", "maximizar").html("<div class='maxi'></div>").prependTo($drag);
            $drag.on('dblclick', function () {
                panel.maximize($ontab);
            });
            $maxi.on("click", function () {
                if (control.onMaximize) {
                    if (!control.onMaximize()) {
                        panel.maximize($ontab);
                    }
                } else {
                    panel.maximize($ontab);
                }
            });
        }
        if (control.close) {
            var $close = $("<div />").addClass("ontab-button btn-ontab-close").attr("title", "fechar").text("x").prependTo($drag);
            $close.on("click", function () {
                closePanel($ontab, control.blur, control.onClose);
            });
        }
        if (control.drag) {
            panel.drag($ontab, $drag);
        }

        $ontab.off("mousedown").on("mousedown", function () {
            $(this).css("z-index", getLastIndex());
        });

        setTimeout(function () {
            $ontab.css("z-index", getLastIndex())
        },1);

        panelScrool(control.blur);

        if (control.clickOut) {
            $(document).on("mousedown", function (e) {
                if (!$ontab.is(e.target) && $ontab.has(e.target).length === 0) {
                    if (!$ontab.attr("data-minimize") || $ontab.attr("data-minimize") === "0") {
                        if (control.clickOut === "minimize") {
                            panel.minimize($ontab);
                        } else {
                            closePanel($ontab, control.blur, control.onClose);
                        }
                    }
                }
            });
        }

        if (control.timeOut) {
            setTimeout(function () {
                $ontab.css("transition-duration", (control.speed * 1.3) + "s");
                if (control.timeOut.out === "left" || control.timeOut.out === "right") $ontab.css("left", (control.timeOut.out === "left" ? (parseInt($ontab.width()) * -1) : $(window).width()));
                else $ontab.css("top", (control.timeOut.out === "top" ? parseInt($ontab.height()) * -1 : $(window).height()));

                setTimeout(function () {
                    closePanel($ontab, control.blur, control.onClose);
                }, control.speed * 1000);
            }, (typeof (control.timeOut.time) === "number" ? control.timeOut.time : 2500));
        }

        setTimeout(function () {
            $ontab.css("transition-duration", "0s");
        }, control.speed * 1000);
    };

    $.fn.scrollBlock = function (enable) {
        if (typeof(enable) === "undefined" || enable) {
            window.oldScrollPos = $(window).scrollTop();

            $(window).on('scroll.scrolldisabler', function (event) {
                $(window).scrollTop(window.oldScrollPos);
                event.preventDefault();
            });
        } else {
            $(window).off('scroll.scrolldisabler');
        }
    };
}(jQuery));

function ajaxLoad($body, $src, $param, done) {
    var request = $.post($src, $param);
    request.fail(function () {
        $("html").panel(themeErro("Falha ao carregar", "Oppps! Não foi encontrado o destino ou um erro ocorreu."));
    }).done(function (data) {
        $(data).appendTo($body);
        if(typeof(done) !== "undefined") {
            done();
        }
    });

    return $body;
}

function themeErro(title, content) {
    return {
        css: {
            width: '40%',
            height: 'auto',
            left: 'near-right',
            top: 'near-bottom',
            'border-radius': '20px',
            'border-color': '#FFFFFF'
        },
        header: {
            html: title,
            css: {
                background: 'red',
                color: '#FFFFFF'
            }
        },
        body: {
            html: content,
            css: {
                'text-align': 'center',
                'font-size': '1.5em',
                'padding': '10px 20px',
                'background': '#EEE',
                'color': '##555'
            }
        },
        control: {
            minimize: false,
            maximize: false,
            drag: false,
            clickOut: true,
            timeOut: true
        }
    };
}

function processaCss(style) {
    if (typeof(style.width) === "string") {
        if (style.width.match(/^\d{1,3}%$/g)) style.width = parseInt($(window).width()) * (parseInt(style.width) * 0.01);
        else if (style.width.match(/^\d{1,3}[a-z]{1,3}$/g)) style.width = parseInt(style.width);
    }

    style.width = (style.width > $(document).width() ? $(document).width() : style.width);

    if (typeof(style.height) === "string") {
        if (style.height.match(/^\d{1,3}%$/g)) style.height = parseInt($(window).height()) * (parseInt(style.height) * 0.01);
        else if (style.height.match(/^\d{1,3}[a-z]{1,3}$/g)) style.height = parseInt(style.height);
    }

    style.height = (style.height > $(document).height() ? $(document).height() : style.height);

    if (typeof(style.top) === "string") {
        if (style.top.match(/^\d{1,3}%$/g)) style.top = parseInt($(window).height()) * (parseInt(style.top) * 0.01);
        else if (style.top.match(/^\d{1,3}[a-z]{1,3}$/g)) style.top = parseInt(style.top);
        else if (style.top === "center") style.top = parseInt($(window).height()) * 0.5 - (typeof(style.height) === "number" ? style.height : 100) * 0.5 - 1;
        else if (style.top === "top") style.top = 0;
        else if (style.top === "bottom") style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 1;
        else if (style.top === "near-bottom") style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 45;
        else if (style.top === "near-top") style.top = 45;
    }

    if (typeof(style.left) === "string") {
        if (style.left.match(/^\d{1,3}%$/g)) style.left = parseInt($(window).width()) * (parseInt(style.left) * 0.01);
        else if (style.left.match(/^\d{1,3}[a-z]{1,3}$/g)) style.left = parseInt(style.left);
        else if (style.left === "center") style.left = parseInt($(window).width()) * 0.5 - style.width * 0.5;
        else if (style.left === "left") style.left = 0;
        else if (style.left === "right") style.left = parseInt($(window).width()) - style.width;
        else if (style.left === "near-left") style.left = 45;
        else if (style.left === "near-right") style.left = parseInt($(window).width()) - style.width - 45;
    }

    return style;
}

var timeout;

function blur() {
    timeout = setTimeout(function () {
        $("body").children("*:not(script, style, .ontab)").each(function () {
            $(this).addClass('ontab-blur');
        });
    }, 75);
}

function getCenterTopTarget($target) {
    return parseInt($target.offset().top - $(window).scrollTop()) + parseInt($target.height() * 0.5);
}

function getCenterLeftTarget($target) {
    return parseInt($target.offset().left) + parseInt($target.width() * 0.5);
}

function blurOut() {
    clearTimeout(timeout);
    $(".ontab-blur").removeClass('ontab-blur');
}

function closeTab() {
    var zindex = 0;
    var $ontab = $(".ontab").first();
    $(".ontab").each(function () {
        if($(this).attr("data-minimize") === "0" && parseInt($(this).css("z-index")) >= zindex){
            zindex = parseInt($(this).css("z-index"));
            $ontab = $(this);
        }
    });
    $ontab.find(".ontab-header").find(".btn-ontab-close").trigger("click");
}

function closePanel($panel, blur, onClose) {
    if (onClose) {
        if (onClose()) {
            return false;
        }
    }

    if ($panel.attr("data-minimize") === "1") {
        $panel.attr("data-minimize", 0);
        reazusteMinimalize();
    }

    $panel.remove();

    setTimeout(function () {
        panelScrool(blur);
    }, 1);
}

function stop(event, M) {
    $(document).off('mousemove mouseup');
    return dragResizeModule(event, M);
}

function dragResizeAction($ontab, $resize, key, haveResize, onResize, onDrag) {
    $resize.on('mousedown', {e: $ontab, k: key}, function (v) {
        $ontab.css({"transition-duration": "0s", "z-index": getLastIndex($ontab)});
        var changeState = 0;
        var mii = {'x': event.pageX, 'y': event.pageY};
        var d = v.data, p = {};
        var windowsTab = d.e;
        if (windowsTab.css('position') !== 'relative') {
            try {
                windowsTab.position(p);
            } catch (e) {
            }
        }
        var M = {
            h: $resize,
            X: p.left || getInt(windowsTab, 'left') || 0,
            Y: p.top || getInt(windowsTab, 'top') || 0,
            W: getInt(windowsTab, 'width') || windowsTab[0].scrollWidth || 0,
            H: getInt(windowsTab, 'height') || windowsTab[0].scrollHeight || 0,
            pX: v.pageX,
            pY: v.pageY,
            k: d.k,
            o: windowsTab
        };

        $(document).mousemove(function (event) {
            if (changeState < 1) {
                if (event.pageX > mii.x + 12 || event.pageX < mii.x - 12 || event.pageY > mii.y + 12 || event.pageY < mii.y - 12) {
                    changeState = 1;
                }
            }

            if ($ontab.attr("data-maximize") === "1" && changeState === 1) {
                $ontab.attr("data-maximize", 0).css({
                    'transition-duration': '0s',
                    'width': parseInt($ontab.attr("data-width")) + 'px',
                    'height': parseInt($ontab.attr("data-height")) + 'px'
                }).find(".ontab-content").css("height", parseInt($ontab.attr("data-height")) - (haveResize ? 45 : 30) + 'px');

                if (haveResize) resize($ontab, $ontab.find(".ontab-resize").css("cursor", "se-resize"), haveResize, onResize, onDrag);
            }

            var newPosition = dragResizeModule(event, M);
            windowsTab.css(newPosition);
            if (M.k === "r") {
                windowsTab.find(".ontab-content").css({height: newPosition.height - (haveResize ? 45 : 30)});
            }

        }).mouseup(function (event) {
            if (changeState === 1) {
                var newPosition = stop(event, M);
                windowsTab.css(newPosition);
                if (M.k === "r") {
                    windowsTab.find(".ontab-content").css({height: newPosition.height - (haveResize ? 45 : 30)});
                    if (onResize) onResize();
                } else {
                    if (onDrag) onDrag();
                }
                changeState = 0;
            } else {
                stop(event, M);
                if ($ontab.attr("data-maximize") === "1") {
                    $ontab.css({
                        'top': -1 + 'px',
                        'left': 0
                    });
                }
            }
        });

        return false;
    });
}

function resize($ontab, $resize, resize, onResize, onDrag) {
    dragResizeAction($ontab, $resize, 'r', resize, onResize, onDrag);
}

function minimizePanelOut($panel, speed, blur, resize, onResize, onDrag) {

    $panel.find(".ontab-header").off("click");
    $panel.attr("data-minimize", 0);

    if ($panel.attr("data-maximize") === "1") {
        maximizePanelIn($panel, resize);

    } else {
        $panel.css({
            "top": parseInt($panel.attr("data-top")) + "px",
            "left": parseInt($panel.attr("data-left")) + "px",
            "width": parseInt($panel.attr("data-width")) + "px",
            "height": parseInt($panel.attr("data-height")) + "px"
        });
        panelScrool(blur);
    }

    if ($panel.attr("data-drag") === "1") dragResizeAction($panel, $panel.find(".ontab-header"), 'd', resize, onResize, onDrag);

    reazusteMinimalize();

    setTimeout(function () {
        $panel.css("transition-duration", "0s");
    }, speed * 1000);
}

function minimizePanelIn($panel, speed, blur) {
    if ($panel.attr("data-maximize") === "0") storePosition($panel);

    var left = 0;
    $(".ontab").each(function () {
        if ($(this).attr("data-minimize") === "1") {
            left += parseInt($(this).css("min-width"));
        }
    });

    $panel.attr("data-minimize", 1).css({
        "transition-duration": speed + "s",
        "top": wht - 30 + "px",
        "left": left,
        "width": 0,
        "height": 0
    });

    panelScrool(blur);
}

function maximizePanelOut($panel, speed, haveResize, onResize, onDrag) {
    $panel.attr("data-maximize", 0).css({
        "transition-duration": speed + "s",
        'width': parseInt($panel.attr("data-width")) + 'px',
        'height': parseInt($panel.attr("data-height")) + 'px',
        'top': parseInt($panel.attr("data-top")) + 'px',
        'left': parseInt($panel.attr("data-left")) + 'px'
    }).find(".ontab-content").css("height", parseInt($panel.attr("data-height")) - (haveResize ? 45 : 30) + 'px');

    setTimeout(function () {
        $panel.css("transition-duration", "0s");
    }, speed * 1000);

    if (haveResize) resize($panel, $panel.find(".ontab-resize").css("cursor", "se-resize"), haveResize, onResize, onDrag);
}

function maximizePanelIn($panel, speed, haveResize) {
    if ($panel.attr("data-minimize") === "1") {
        storePosition($panel);
    }

    $panel.attr("data-maximize", 1).css({
        "transition-duration": speed + "s",
        'width': '100%',
        'height': '100%',
        'top': '-1px',
        'left': '0'
    }).find(".ontab-content").css("height", wht - (haveResize ? 45 : 30) + "px");

    if (haveResize) $panel.find(".ontab-resize").off("mousedown").css("cursor", "initial");
}

function dragResizeModule(v, M) {
    if (M.k === 'd') {
        var left = M.X + v.pageX - M.pX;
        var top = M.Y + v.pageY - M.pY;
        left = left < 0 ? 0 : left;
        top = top < -1 ? -1 : top;

        if ((left !== 0 || top > -1) && M.o.attr("data-maximize") === '0') {
            M.o.attr("data-left", left);
            M.o.attr("data-top", top);
        }

        return {left: left, top: top};
    } else {
        var width = Math.max(v.pageX - M.pX + M.W, 0);
        var height = Math.max(v.pageY - M.pY + M.H, 0);

        M.o.attr("data-width", (wwt < parseInt(M.o.attr("data-left")) + width ? wwt - parseInt(M.o.attr("data-left")) : width));
        M.o.attr("data-height", (wht < (parseInt(M.o.attr("data-top")) + height + 3) ? wht - parseInt(M.o.attr("data-top")) - 3 : height));

        return {width: M.o.attr("data-width"), height: M.o.attr("data-height")};
    }
}

function storePosition($panel) {
    $panel.attr({
        "data-width": 2 + parseInt($panel.width() + parseInt($panel.css("padding-left")) + parseInt($panel.css("padding-right"))),
        "data-height": 2 + parseInt($panel.height() + parseInt($panel.css("padding-top")) + parseInt($panel.css("padding-bottom"))),
        "data-top": $panel.offset().top - $(window).scrollTop(),
        "data-left": $panel.offset().left
    });
}

function panelScrool(isBlur) {
    var haveSomeOntabOpen = false;
    if ($(".ontab").length) {
        $(".ontab").each(function () {
            if ($(this).attr("data-minimize") === "0") {
                haveSomeOntabOpen = true;
            }
        });
    }

    if (haveSomeOntabOpen) {
        $("html").scrollBlock();
        if (isBlur) blur();
    } else {
        $("html").scrollBlock(false);
        if (isBlur) blurOut();
    }
}

function getLastIndex() {
    var zindex = 1;
    $(".ontab").each(function () {
        zindex = ($(this).attr("data-minimize") === "0" && parseInt($(this).css("z-index")) >= zindex ? parseInt($(this).css("z-index")) + 1 : zindex);
    });

    return zindex;
}

function reazusteMinimalize() {
    var i = 0;
    $(".ontab").each(function () {
        if ($(this).attr("data-minimize") === "1") {
            $(this).css("left", i * parseInt($(this).css("min-width")));
            i++;
        }
    });
}

function getInt(E, k) {
    return parseInt(E.css(k)) || false;
}

$("#btnt").on("click", function () {
    $(document).panel();
});