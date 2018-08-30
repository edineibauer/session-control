<div class="col s12 section menu-vertical {$class}">
    <div class="vertical">
        <button class="btn-floating color-grey-light">
            <input type="hidden" value="{$value}" data-model="{$column}" id="{$column}" />
            <i class="material-icons prefix pointer uploadImage" data-folder="gallery" data-title="{$title}">add_a_photo</i>
        </button>
        <button class="btn-floating color-grey-light">
            <i class="material-icons prefix pointer frame">texture</i>
        </button>
        <button class="btn-floating color-grey-light">
            <i class="material-icons prefix pointer rotate">rotate_90_degrees_ccw</i>
        </button>
        <button class="btn-floating color-grey-light">
            <i class="material-icons prefix pointer switch">switch_camera</i>
        </button>
    </div>
    <img src="{$value}">
</div>
