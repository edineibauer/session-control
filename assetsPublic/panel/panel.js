/*ResizeSensor AND elementQueries*/
!function (e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.ResizeSensor = t()
}("undefined" != typeof window ? window : this, function () {
    function e(e, t) {
        var i = Object.prototype.toString.call(e),
            n = "[object Array]" === i || "[object NodeList]" === i || "[object HTMLCollection]" === i || "[object Object]" === i || "undefined" != typeof jQuery && e instanceof jQuery || "undefined" != typeof Elements && e instanceof Elements,
            o = 0, s = e.length;
        if (n) for (; s > o; o++) t(e[o]); else t(e)
    }

    if ("undefined" == typeof window) return null;
    var t = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (e) {
        return window.setTimeout(e, 20)
    }, i = function (n, o) {
        function s() {
            var e = [];
            this.add = function (t) {
                e.push(t)
            };
            var t, i;
            this.call = function () {
                for (t = 0, i = e.length; i > t; t++) e[t].call()
            }, this.remove = function (n) {
                var o = [];
                for (t = 0, i = e.length; i > t; t++) e[t] !== n && o.push(e[t]);
                e = o
            }, this.length = function () {
                return e.length
            }
        }

        function r(e, i) {
            if (e) {
                if (e.resizedAttached) return void e.resizedAttached.add(i);
                e.resizedAttached = new s, e.resizedAttached.add(i), e.resizeSensor = document.createElement("div"), e.resizeSensor.className = "resize-sensor";
                var n = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;",
                    o = "position: absolute; left: 0; top: 0; transition: 0s;";
                e.resizeSensor.style.cssText = n, e.resizeSensor.innerHTML = '<div class="resize-sensor-expand" style="' + n + '"><div style="' + o + '"></div></div><div class="resize-sensor-shrink" style="' + n + '"><div style="' + o + ' width: 200%; height: 200%"></div></div>', e.appendChild(e.resizeSensor), e.resizeSensor.offsetParent !== e && (e.style.position = "relative");
                var r, d, c, l, f = e.resizeSensor.childNodes[0], a = f.childNodes[0], h = e.resizeSensor.childNodes[1],
                    u = e.offsetWidth, z = e.offsetHeight, v = function () {
                        a.style.width = "100000px", a.style.height = "100000px", f.scrollLeft = 1e5, f.scrollTop = 1e5, h.scrollLeft = 1e5, h.scrollTop = 1e5
                    };
                v();
                var p = function () {
                    d = 0, r && (u = c, z = l, e.resizedAttached && e.resizedAttached.call())
                }, y = function () {
                    c = e.offsetWidth, l = e.offsetHeight, r = c != u || l != z, r && !d && (d = t(p)), v()
                }, m = function (e, t, i) {
                    e.attachEvent ? e.attachEvent("on" + t, i) : e.addEventListener(t, i)
                };
                m(f, "scroll", y), m(h, "scroll", y)
            }
        }

        e(n, function (e) {
            r(e, o)
        }), this.detach = function (e) {
            i.detach(n, e)
        }
    };
    return i.detach = function (t, i) {
        e(t, function (e) {
            e && (e.resizedAttached && "function" == typeof i && (e.resizedAttached.remove(i), e.resizedAttached.length()) || e.resizeSensor && (e.contains(e.resizeSensor) && e.removeChild(e.resizeSensor), delete e.resizeSensor, delete e.resizedAttached))
        })
    }, i
});
/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
;
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(['./ResizeSensor.js'], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require('./ResizeSensor.js'));
    } else {
        root.ElementQueries = factory(root.ResizeSensor);
        root.ElementQueries.listen();
    }
}(typeof window !== 'undefined' ? window : this, function (ResizeSensor) {

    /**
     *
     * @type {Function}
     * @constructor
     */
    var ElementQueries = function() {

        var trackingActive = false;
        var elements = [];

        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = window.getComputedStyle(element, null).fontSize;
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param {HTMLElement} element
         * @param {*} value
         * @returns {*}
         */
        function convertToPx(element, value) {
            var numbers = value.split(/\d/);
            var units = numbers[numbers.length-1];
            value = parseFloat(value);
            switch (units) {
                case "px":
                    return value;
                case "em":
                    return value * getEmSize(element);
                case "rem":
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case "vw":
                    return value * document.documentElement.clientWidth / 100;
                case "vh":
                    return value * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === "vmin" ? "min" : "max"];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = {};
            var key, option, width = 0, height = 0, value, actualValue, attrValues, attrValue, attrName;

            /**
             * @param {Object} option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                var idx = [option.mode, option.property, option.value].join(',');
                this.options[idx] = option;
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (key in this.options) {
                    if (!this.options.hasOwnProperty(key)){
                        continue;
                    }
                    option = this.options[key];

                    value = convertToPx(this.element, option.value);

                    actualValue = option.property == 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode == 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode == 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ').indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if(!attributes.hasOwnProperty(k)) continue;

                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k], attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                element.elementQueriesSensor = new ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();

            if (trackingActive && elements.indexOf(element) < 0) {
                elements.push(element);
            }
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        var allQueries = {};
        function queueQuery(selector, mode, property, value) {
            if (typeof(allQueries[mode]) == 'undefined') allQueries[mode] = {};
            if (typeof(allQueries[mode][property]) == 'undefined') allQueries[mode][property] = {};
            if (typeof(allQueries[mode][property][value]) == 'undefined') allQueries[mode][property][value] = selector;
            else allQueries[mode][property][value] += ','+selector;
        }

        function getQuery() {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            return query;
        }

        /**
         * Start the magic. Go through all collected rules (readRules()) and attach the resize-listener.
         */
        function findElementQueriesElements() {
            var query = getQuery();

            for (var mode in allQueries) if (allQueries.hasOwnProperty(mode)) {

                for (var property in allQueries[mode]) if (allQueries[mode].hasOwnProperty(property)) {
                    for (var value in allQueries[mode][property]) if (allQueries[mode][property].hasOwnProperty(value)) {
                        var elements = query(allQueries[mode][property][value]);
                        for (var i = 0, j = elements.length; i < j; i++) {
                            setupElement(elements[i], {
                                mode: mode,
                                property: property,
                                value: value
                            });
                        }
                    }
                }

            }
        }

        /**
         *
         * @param {HTMLElement} element
         */
        function attachResponsiveImage(element) {
            var children = [];
            var rules = [];
            var sources = [];
            var defaultImageId = 0;
            var lastActiveImage = -1;
            var loadedImages = [];

            for (var i in element.children) {
                if(!element.children.hasOwnProperty(i)) continue;

                if (element.children[i].tagName && element.children[i].tagName.toLowerCase() === 'img') {
                    children.push(element.children[i]);

                    var minWidth = element.children[i].getAttribute('min-width') || element.children[i].getAttribute('data-min-width');
                    //var minHeight = element.children[i].getAttribute('min-height') || element.children[i].getAttribute('data-min-height');
                    var src = element.children[i].getAttribute('data-src') || element.children[i].getAttribute('url');

                    sources.push(src);

                    var rule = {
                        minWidth: minWidth
                    };

                    rules.push(rule);

                    if (!minWidth) {
                        defaultImageId = children.length - 1;
                        element.children[i].style.display = 'block';
                    } else {
                        element.children[i].style.display = 'none';
                    }
                }
            }

            lastActiveImage = defaultImageId;

            function check() {
                var imageToDisplay = false, i;

                for (i in children){
                    if(!children.hasOwnProperty(i)) continue;

                    if (rules[i].minWidth) {
                        if (element.offsetWidth > rules[i].minWidth) {
                            imageToDisplay = i;
                        }
                    }
                }

                if (!imageToDisplay) {
                    //no rule matched, show default
                    imageToDisplay = defaultImageId;
                }

                if (lastActiveImage != imageToDisplay) {
                    //image change

                    if (!loadedImages[imageToDisplay]){
                        //image has not been loaded yet, we need to load the image first in memory to prevent flash of
                        //no content

                        var image = new Image();
                        image.onload = function() {
                            children[imageToDisplay].src = sources[imageToDisplay];

                            children[lastActiveImage].style.display = 'none';
                            children[imageToDisplay].style.display = 'block';

                            loadedImages[imageToDisplay] = true;

                            lastActiveImage = imageToDisplay;
                        };

                        image.src = sources[imageToDisplay];
                    } else {
                        children[lastActiveImage].style.display = 'none';
                        children[imageToDisplay].style.display = 'block';
                        lastActiveImage = imageToDisplay;
                    }
                } else {
                    //make sure for initial check call the .src is set correctly
                    children[imageToDisplay].src = sources[imageToDisplay];
                }
            }

            element.resizeSensor = new ResizeSensor(element, check);
            check();

            if (trackingActive) {
                elements.push(element);
            }
        }

        function findResponsiveImages(){
            var query = getQuery();

            var elements = query('[data-responsive-image],[responsive-image]');
            for (var i = 0, j = elements.length; i < j; i++) {
                attachResponsiveImage(elements[i]);
            }
        }

        var regex = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:min|max)-(?:width|height)[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/mgi;
        var attrRegex = /\[[\s\t]*?(min|max)-(width|height)[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/mgi;
        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match, smatch, attrs, attrMatch;

            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                smatch = match[1] + match[3];
                attrs = match[2];

                while (null !== (attrMatch = attrRegex.exec(attrs))) {
                    queueQuery(smatch, attrMatch[1], attrMatch[2], attrMatch[3]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') || -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        }else if(-1 !== selector.indexOf('min-width') || -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    } else if (3 === rules[i].type) {
                        readRules(rules[i].styleSheet.cssRules);
                    }
                }
            }
        }

        var defaultCssInjected = false;

        /**
         * Searches all css rules and setups the event listener to all elements with element query rules..
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.init = function(withTracking) {
            trackingActive = typeof withTracking === 'undefined' ? false : withTracking;

            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                try {
                    readRules(document.styleSheets[i].cssRules || document.styleSheets[i].rules || document.styleSheets[i].cssText);
                } catch(e) {
                    if (e.name !== 'SecurityError') {
                        throw e;
                    }
                }
            }

            if (!defaultCssInjected) {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.innerHTML = '[responsive-image] > img, [data-responsive-image] {overflow: hidden; padding: 0; } [responsive-image] > img, [data-responsive-image] > img { width: 100%;}';
                document.getElementsByTagName('head')[0].appendChild(style);
                defaultCssInjected = true;
            }

            findElementQueriesElements();
            findResponsiveImages();
        };

        /**
         *
         * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
         *                               (no garbage collection possible if you don not call .detach() first)
         */
        this.update = function(withTracking) {
            this.init(withTracking);
        };

        this.detach = function() {
            if (!trackingActive) {
                throw 'withTracking is not enabled. We can not detach elements since we don not store it.' +
                'Use ElementQueries.withTracking = true; before domready or call ElementQueryes.update(true).';
            }

            var element;
            while (element = elements.pop()) {
                ElementQueries.detach(element);
            }

            elements = [];
        };
    };

    /**
     *
     * @param {Boolean} withTracking allows and requires you to use detach, since we store internally all used elements
     *                               (no garbage collection possible if you don not call .detach() first)
     */
    ElementQueries.update = function(withTracking) {
        ElementQueries.instance.update(withTracking);
    };

    /**
     * Removes all sensor and elementquery information from the element.
     *
     * @param {HTMLElement} element
     */
    ElementQueries.detach = function(element) {
        if (element.elementQueriesSetupInformation) {
            //element queries
            element.elementQueriesSensor.detach();
            delete element.elementQueriesSetupInformation;
            delete element.elementQueriesSensor;

        } else if (element.resizeSensor) {
            //responsive image

            element.resizeSensor.detach();
            delete element.resizeSensor;
        } else {
            //console.log('detached already', element);
        }
    };

    ElementQueries.withTracking = false;

    ElementQueries.init = function() {
        if (!ElementQueries.instance) {
            ElementQueries.instance = new ElementQueries();
        }

        ElementQueries.instance.init(ElementQueries.withTracking);
    };

    var domLoaded = function (callback) {
        /* Internet Explorer */
        /*@cc_on
         @if (@_win32 || @_win64)
         document.write('<script id="ieScriptLoad" defer src="//:"><\/script>');
         document.getElementById('ieScriptLoad').onreadystatechange = function() {
         if (this.readyState == 'complete') {
         callback();
         }
         };
         @end @*/
        /* Mozilla, Chrome, Opera */
        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', callback, false);
        }
        /* Safari, iCab, Konqueror */
        else if (/KHTML|WebKit|iCab/i.test(navigator.userAgent)) {
            var DOMLoadTimer = setInterval(function () {
                if (/loaded|complete/i.test(document.readyState)) {
                    callback();
                    clearInterval(DOMLoadTimer);
                }
            }, 10);
        }
        /* Other web browsers */
        else window.onload = callback;
    };

    ElementQueries.listen = function() {
        domLoaded(ElementQueries.init);
    };

    return ElementQueries;

}));


/* PANEL JS */

var wwt = parseInt($(window).width());
var wht = parseInt($(window).height());

$(function ($) {
    $.fn.panel = function (options) {
        options = options || {};
        options.target = options.target || this;
        options.initial = options.initial || {};
        var id = options.id || Math.floor((Math.random() * 10000000));

        function _init() {

            var panel = {
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
                "z-index": 1000,
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
                "data-top": css.top
            };

            if (control.minimize) attr['data-minimize'] = 0;
            if (control.maximize) attr['data-maximize'] = 0;
            $.extend(attr, options.attr);
            attr.id = id;

            var header = {
                html: "",
                css: {
                    padding: "5px 10px"
                },
                class: ""
            };
            $.extend(header, options.header);
            header.css = processaCss(header.css);
            header.css.background = header.css.background || "#FFFFFF";

            var body = {
                html: '',
                ajax: {
                    src: (typeof HOME !== 'undefined' ? HOME : "./") + "request/post"
                },
                css: {
                    padding: 0
                }
            };
            body = $.extend(true, {}, body, options.body);

            var $ontab = $("<div />").addClass("ontab").appendTo("body");
            var $header = $("<div />").addClass("ontab-header").addClass(header.class).prependTo($ontab);
            var $title = $("<div />").addClass("ontab-title").html(header.html).css(header.css).prependTo($header);
            var headerHeight = parseInt($title.height());
            headerHeight = header.html !== "" && headerHeight < 30 ? 30 : headerHeight;
            $header.css("background", $title.css("background")).css("height", headerHeight);
            var $body = $("<div />").addClass("ontab-content").css(body.css).css("margin-top", parseInt($header.css("height"))).html(body.html).prependTo($ontab);

            /* get WIDTH from auto css style */
            if (css.width === "auto") {
                $ontab.css("width", "auto");
                css.width = parseInt($ontab.width()) + 20;
            }
            if(css.width < 190) css.width = 190;

            /* get HEIGHT from auto css style */
            if (css.height === "auto") {
                $ontab.css("height", "auto");
                css.height = parseInt($ontab.height());
            }
            if(control.resize) css.height += 14;

            /* Converte RIGHT to LEFT position if Exist */
            if (typeof (css.right) !== "undefined") {
                css.left = parseInt($(window).width()) - css.right - css.width;
                delete css.right;
            }

            if (!$.isEmptyObject(options.initial)) {
                options.initial = processaCss(options.initial);
                options.initial.width = css.width;
                options.initial.height = css.height;
                if (typeof (options.initial.right) !== "undefined") {
                    options.initial.left = parseInt($(window).width()) - css.width - options.initial.right;
                    delete options.initial.right;
                }
            }
			
			var contOntab = $(".ontab").length;
			css.left += (contOntab * 10) - contOntab;
			css.top -= (contOntab * 3) - contOntab; 

            /* apply css INITIAL to TAB, so apply css FINAL to TAB to effect */
            $ontab.css(getInitialCss(options));
            attr['data-left'] = css.left;
            attr['data-width'] = css.width;
            attr['data-height'] = css.height;
            $ontab.attr(attr);
            setTimeout(function () {
                delete css['z-index'];
                $ontab.css(css);
            }, 10);

            /* check for request AJAX content */
            if (typeof(body.ajax.param) !== 'undefined' || body.ajax.src !== (typeof (HOME) !== 'undefined' ? HOME : "./") + "request/post") {
                $ontab.loading();
                ajaxLoad(body.ajax.src, body.ajax.param, function (data) {
                    switch (data.response) {
                        case 1 :
                            $body.html(data.data);
                            break;
                        case 2:
                            $body.panel(themeNotify(data.error, "warning", 3000));
                            break;
                        default:
                            $body.panel(themeNotify("Erro ao carregar", "error"));
                    }
                });
            }

            if(control.resize) {
                $ontab.css("resize", "both");
            }

            if (control.minimize) {
                var $mini = $("<div />").addClass("ontab-button btn-ontab-mini").attr("title", "minimizar").text("-").prependTo($header);
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
                var $maxi = $("<div />").addClass("ontab-button btn-ontab-maxi").attr("title", "maximizar").html("<div class='maxi'></div>").prependTo($header);
                $header.on('dblclick', function () {
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
                var $close = $("<div />").addClass("ontab-button btn-ontab-close").attr("title", "fechar").text("x").prependTo($header);
                $close.on("click", function () {
                    closePanel($ontab, id, control.blur, control.onClose);
                });
            }

            if (control.drag) {
                panel.drag($ontab, $header);
            }

            $ontab.off("mousedown").on("mousedown", function () {
                $(this).css("z-index", getLastIndex());
            });

                $ontab.css("z-index", getLastIndex())

            panelScrool(control.blur);

            if (control.clickOut) {
                $(document).on("mousedown", function (e) {
                    if (!$ontab.is(e.target) && $ontab.has(e.target).length === 0) {
                        if (!$ontab.attr("data-minimize") || $ontab.attr("data-minimize") === "0") {
                            if (control.clickOut === "minimize") {
                                panel.minimize($ontab);
                            } else {
                                closePanel($ontab, $body, control.blur, control.onClose);
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
                        closePanel($ontab, $body, control.blur, control.onClose);
                    }, control.speed * 1000);
                }, (typeof (control.timeOut.time) === "number" ? control.timeOut.time : 2500));
            }

            setTimeout(function () {
                $ontab.css("transition-duration", "0s");
            }, control.speed * 1000);

            new ResizeSensor($ontab, function () {
                $ontab.find(".ontab-content").css("height", parseInt($ontab.height()) - parseInt($ontab.find(".ontab-header").height()) - 13);
            });
        }

        function _sensors() {
            setTimeout(function () {
                ElementQueries.init();
            },500);
        }

        return this.each(function () {
            _init();
            _sensors();
            id;
        });
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

function getInitialCss(options) {
    return {
        "top": options.initial.top || getCenterTopTarget(options.target),
        "left": options.initial.left || getCenterLeftTarget(options.target),
        "width": options.initial.width || 0,
        "height": options.initial.height || 0
    };
}

function ajaxLoad(src, param, callback) {
    var request = $.ajax({type: "POST", url: src, data: param, success: callback, dataType: 'json'});
    request.fail(function () {
        $("html").panel(themeNotify("Erro com o Destino", "erro", 2500, "left-top"));
    });
}

function processaCss(style) {

    /* WIDTH */
    if (typeof(style.width) !== "undefined") {
        if (typeof(style.width) === "string") {
            if (style.width.match(/^\d{1,3}%$/g)) style.width = parseInt($(window).width()) * (parseInt(style.width) * 0.01);
            else if (style.width.match(/^\d{1,3}[a-z]{1,3}$/g)) style.width = parseInt(style.width);
        }

        style.width = (style.width > $(document).width() ? $(document).width() : style.width);
    }

    /* HEIGHT */
    if (typeof(style.height) !== "undefined") {
        if (typeof(style.height) === "string" && style.height !== "auto") {
            if (style.height.match(/^\d{1,3}%$/g)) style.height = parseInt($(window).height()) * (parseInt(style.height) * 0.01);
            else if (style.height.match(/^\d{1,3}[a-z]{1,3}$/g)) style.height = parseInt(style.height);
        }

        style.height = (style.height > $(document).height() ? $(document).height() : style.height); 
    }

    /* TOP & BOTTOM */
    if (typeof(style.bottom) !== "undefined") {
        if (typeof(style.bottom) === "string" && !style.bottom.match(/^\d{1,3}[a-z]{1,3}$/g)) {
            if (style.bottom.match(/^\d{1,3}%$/g)) style.top = parseInt($(window).height()) - (parseInt($(window).height()) * (parseInt(style.bottom) * 0.01));
            else if (style.bottom === "center") style.top = parseInt($(window).height()) * 0.5 - (typeof(style.height) === "number" ? style.height : 100) * 0.5 - 1;
            else if (style.bottom === "top") style.top = 0;
            else if (style.bottom === "bottom") style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 1;
            else if (style.bottom === "near-top") style.top = 35;
            else if (style.bottom.match(/near/i)) style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 15;
        } else {
            style.top = parseInt($(window).height()) - parseInt(style.bottom);
        }
        delete style.bottom;

    } else if (typeof(style.top) === "string") {
        if (style.top.match(/^\d{1,3}%$/g)) style.top = parseInt($(window).height()) * (parseInt(style.top) * 0.01);
        else if (style.top.match(/^\d{1,3}[a-z]{1,3}$/g)) style.top = parseInt(style.top);
        else if (style.top === "center") style.top = parseInt($(window).height()) * 0.5 - (typeof(style.height) === "number" ? style.height : 100) * 0.5 - 1;
        else if (style.top === "top") style.top = 0;
        else if (style.top === "bottom") style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 1;
        else if (style.top === "near-bottom") style.top = parseInt($(window).height()) - (typeof(style.height) === "number" ? style.height : 100) - 15;
        else if (style.top.match(/near/i)) style.top = 35;
    }

    /* LEFT & RIGHT */
    if (typeof (style.right) !== "undefined" && typeof(style.right) === "string") {

        if (style.right === "left") {
            delete style.right;
            style.left = 0;

        } else if (style.right === "near-left") {
            delete style.right;
            style.left = 45;

        } else {
            delete style.left;
            if (style.right.match(/^\d{1,3}%$/g)) style.right = parseInt($(window).width()) * (parseInt(style.right) * 0.01);
            else if (style.right.match(/^\d{1,3}[a-z]{1,3}$/g)) style.right = parseInt(style.right);
            else if (style.right === "right") style.right = 0;
            else if (style.right.match(/near/i)) style.right = 45;
        }

    } else if (typeof(style.left) === "string") {

        if (style.left === "right") {
            delete style.left;
            style.right = 0;

        } else if (style.left === "near-right") {
            delete style.left;
            style.right = 45;

        } else {
            if (style.left.match(/^\d{1,3}%$/g)) style.left = parseInt($(window).width()) * (parseInt(style.left) * 0.01);
            else if (style.left.match(/^\d{1,3}[a-z]{1,3}$/g)) style.left = parseInt(style.left);
            else if (style.left === "center") style.left = parseInt($(window).width()) * 0.5 - style.width * 0.5;
            else if (style.left === "left") style.left = 0;
            else if (style.left.match(/near/i)) style.left = 45;
        }
    }

    return style;
}

var timeout;

function blur() {
    timeout = setTimeout(function () {
        $("body").children("*:not(script, style, .ontab)").each(function () {
            $(this).addClass('ontab-blur');
        });
    }, 255);
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

function closePanel($panel, retorno, blur, onClose) {
    if (onClose) {
        if (onClose(retorno)) {
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

    $panel.attr("data-minimize", 0).find(".ontab-header").off("click");

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
    var zindex = 1000;
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


/* PANEL THEME JS */

function themes(theme) {
    if (theme.match(/erro/i))
        return {background: '#f44336', color: "#FFFFFF"};
    else if (theme.match(/(warn|alert|attem|aten|aviso)/i))
        return {background: '#ff9800', color: "#FFFFFF"};
    else
        return {background: '#8bc34a', color: "#FFFFFF"};
}

function themesIcon(theme) {
    if (theme.match(/(erro|dang)/i))
        return "error";
    else if (theme.match(/(warn|alert|attem|aten|aviso)/i))
        return "warning";
    else
        return "done";
}

function themeWindow(title, param, funcao) {
    return {
        header: {
            html: title
        },
        body: {
            ajax: {
                src: HOME + "request/post",
                param: param
            },
            css: {
                padding: "0 15px"
            }
        },
        control: {
            onClose: funcao
        }
    };
} 

function toast(mensagem, theme, time, position) {
    $("body").panel(themeNotify(mensagem, theme, time, position));
}

function themeNotify(title, theme, time, position) {
    /* check for theme and time set */
    if (typeof (time) !== "undefined" && typeof (theme) === "number") {
        var t = theme;
        theme = time;
        time = t;
    } else if (typeof (theme) === "undefined") {
        time = 2000;
        theme = "infor";
    } else if (typeof (time) === "undefined" && typeof (theme) === "number") {
        time = theme;
        theme = "infor";
    }

    var initial = {height: 50, width: 1000};
    var cssPosition = {};
    position = position || "right-top";
    var action = "right";
    $.each(position.match(/^\w+\s\w+$/i) ? position.split(' ') : position.split('-'), function (i, e) {
        if (i === 0) {
            action = e;
            if (action === "bottom" || action === "top") initial = {height: 100, width: 200};
        }
        cssPosition[e] = "near";

        if (action === "left" || action === "right")
            initial[e] = (e === "bottom" || e === "top" ? "near" : -1000);
        else
            initial[e] = (e === "left" || e === "right" ? "near" : -100);
    }); 

    var css = themes(theme);
    var themeIcon = themesIcon(theme);
    css.padding = '15px';
    css['font-size'] = "1.1em";
    css['font-family'] = "roboto, sans-serif";
	css['min-height'] = 61;
    var retorno = {
        initial: initial,
        css: {
            'width': 'auto',
            'height': 'auto',
            'border-radius': '5px',
            'border-width': 0
        },
        header: {
            css: {
                "min-height": 0,
                "height": 0,
                "padding": 0
            }
        },
        body: {
            html: "<i class='material-icons left padding-right'>" + themeIcon + "</i><span class='left'>" + title + "</span>",
            css: css
        },
        control: {
            minimize: false,
            maximize: false,
            drag: false,
            close: false,
            clickOut: false,
            resize: false,
            timeOut: {
                time: time,
                out: action
            }
        }
    };

    if (typeof (cssPosition.right) === "undefined") retorno.css.left = cssPosition.left;
    else retorno.css.right = cssPosition.right;
    if (typeof (cssPosition.bottom) === "undefined") retorno.css.top = cssPosition.top;
    else retorno.css.bottom = cssPosition.bottom;

    return retorno;
}