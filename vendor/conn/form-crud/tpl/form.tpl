{$scripts}
<div class='form-control row font-large'>
    <div class="row relative form-crud" id='form_{$entity}' data-entity="{$entity}">
        <div class="panel">
            <input type='hidden' rel='title' value='{$relevant}'>
            {foreach $inputs as $input}
                {$input}
            {/foreach}
            <input type="hidden" value="{$autoSave}" id="autoSave"/>
            <input type="hidden" value="{$callback}" id="callbackAction"/>
            {if !$autoSave}
                <div class="col padding-16">
                    <button class="btn color-teal hover-shadow opacity hover-opacity-off" id="saveFormButton"><i
                                class="material-icons left padding-right">save</i>Salvar
                    </button>
                </div>
            {/if}
        </div>
        <script>
            (function () {
                var $head = document.getElementsByTagName('head')[0];
                if (document.querySelector("script[data-info='form-crud']") === null) {
                    var style = document.createElement('link');
                    style.rel = "stylesheet";
                    style.href = HOME + 'vendor/conn/form-crud/assets/main.min.css?v=' + VERSION;
                    $head.appendChild(style);

                    var script = document.createElement('script');
                    script.setAttribute("data-info", "form-crud");
                    script.src = HOME + 'vendor/conn/form-crud/assets/main.min.js?v=' + VERSION;
                    $head.appendChild(script);
                } else {
                    loadForm('#form_{$entity}');
                }
            })();
        </script>
    </div>
</div>
