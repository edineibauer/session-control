$(function ($) {
    $.fn.model = function () {

        var dados = {
            entity: this.attr("data-table") || "null",
            callback: this.attr("action") || "null"
        };

        var model = {
            setDados: function($this) {
                if (typeof($this.attr("data-model")) !== "undefined") {
                    dados[$this.attr("data-model")] = $this.val();
                }
            },
            update: function ($this) {
                $this.find("input").each(function () {
                    model.setDados($(this));
                });

                $this.find("textarea").each(function () {
                    model.setDados($(this));
                });

                $this.find("select").each(function () {
                    model.setDados($(this));
                });
            }
        };

        model.update(this);

        this.on("keyup", "input", function () {
            model.setDados($(this));
        });

        this.on("click", "button[type=submit], input[type=submit]", function () {

        });

        return this;
    };

}(jQuery));