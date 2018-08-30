<?php
$folder = strip_tags(trim(filter_input(INPUT_POST, "folder", FILTER_DEFAULT)));
$folder = $folder ? "uploads/{$folder}" : "uploads/geral";
?>
<script>
    var folderGallery = "<?=$folder?>";
</script>
<link rel="stylesheet" href="<?= HOME ?>vendor/conn/form-crud/assets/css/dropzone.css"/>
<script src="<?= HOME ?>vendor/conn/form-crud/assets/js/dropzone.js"></script>
<script src="<?= HOME ?>vendor/conn/form-crud/assets/js/dropzone-config.js"></script>

<div class="row container">

    <div class="col s12"><br></div>

    <div class="col s12">
        <div class="dropzone"></div>
    </div>

    <div class="col s12"><br></div>

    <div class="col s12">
        <label for="imageLink">Busque uma imagem</label>
        <input type="text" id="imageLink" placeholder="cole o link de uma imagem, ou pesquise na sua biblioteca...">
    </div>
    <div class="col s12"><br></div>

    <div class="col s12 imageGallery"></div>

</div>