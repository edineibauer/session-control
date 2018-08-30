var saveLinkTime = null;
var gallery = [];

//Drop upload
$(".dropzone").dropzone({
    url: "vendor/conn/form-crud/ajax/galleryUpload.php",
    params: {folder: folderGallery},
    acceptedFiles: "image/*",
    success: function (file, resp) {
        gallery.push(file.upload.filename);
        addToGallery(file.upload.filename);
    }
});

//image select
$(".imageGallery").on("click", ".gallery", function () {
    sessionStorage.setItem("gallery-image", $(this).attr("data-src"));
    closeTab();
});

//link upload or search
$("#imageLink").off("keyup paste").on("keyup paste", function () {
    clearTimeout(saveLinkTime);
    saveLinkTime = setTimeout(function () {
        var $link = $("#imageLink");
        var link = $link.val();
        var galleryMatchs = search(link);
        if (!galleryMatchs) {
            if (link.length > 12 && link.match(/\w+\.\w+/i)) {
                $link.val("").attr("placeholder", "carregando...").loading();
                $.post(HOME + "request/post", {
                    lib: 'form-crud',
                    file: 'galleryCopy',
                    folder: folderGallery,
                    link: link
                }, function (g) {
                    $link.attr("placeholder", "cole o link de uma imagem, ou pesquise na sua biblioteca...");
                    if (g.response === 1) {
                        $link.val("");
                        gallery.push(g);
                        addToGallery(g);
                    } else if(g.response === 2){
                        $link.val(g.data);
                        resultGallery(search(g.data));
                    } else {
                        $link.panel(themeErro("Erro", "Não foi possível carregar.")).focus();
                    }
                }, 'json');
            }
        } else {
            $link.loading();
            resultGallery(galleryMatchs);
        }
    }, 100);
}).focus();

function resultGallery(search) {
    $(".imageGallery").html("");
    $.each(search, function (i, e) {
        addToGallery(e);
    });
}

function search(name) {
    var search = name.toUpperCase();
    var array = $.grep(gallery, function (value) {
        return value.toUpperCase().indexOf(search) >= 0;
    });

    return (array.length > 0 ? array : false);
}

function readGallery() {
    $.post(HOME + "request/post", {
        lib: 'form-crud',
        file: 'galleryRead',
        folder: folderGallery
    }, function (data) {
        gallery = data.data;
        data.data.reverse();
        $.each(data.data, function (i, e) {
            if (i < 30) {
                addToGallery(e);
            }
        });
    }, 'json');
}

function addToGallery(name) {
    $(".imageGallery").prepend("<div class='z-depth-2 gallery' data-src='" + folderGallery + "/" + name + "'><img src='" + HOME + folderGallery + "/" + name + "'><h6>" + name.substr(0, 20) + "</h6></div>");
}

$(function () {
    readGallery();
});