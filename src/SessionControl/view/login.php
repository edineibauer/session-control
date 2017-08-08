

<html class="row teal lighten-1">
<head>
    <title>Login</title>
    <link rel="stylesheet" href="assets/my/css/fonts.css">
    <link rel="stylesheet" href="assets/my/css/helper.css">
    <link rel="stylesheet" href="assets/materialize/css/materialize.min.css">
</head>
<body class='container row pd-content60'>
    <div class='container al-center font-size13 white-text upper'>área restrita</div>
    <div class="card container col l6 m10 s12 push-m1 push-l3 center-align pd-content30">
        <div class="row">
            <div class="input-field container">
                <input id="emaillog" type="email" class="validate">
                <label for="emaillog">Email</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field container">
                <input id="passlog" type="password" class="validate">
                <label for="passlog">Senha</label>
            </div>
        </div>
        <div class="container pd-medium al-center" style="float:initial">
            <a href="<?= defined('HOME') ? HOME . DIRECTORY_SEPARATOR : ""?>cadastro-usuario" class="waves-effect waves-teal btn-flat color-gray">Cadastre-se</a>
            <button id="loginbtn" class="waves-effect waves-light btn" onclick="logiin();">
                Entrar
            </button>
        </div>
    </div>

    <div class="row clearfix"></div>

    <div class="container col l6 m10 s12 push-m1 push-l3 al-right">
        <a href="<?= defined('HOME') ? HOME . DIRECTORY_SEPARATOR : ""?>esquici-a-senha" class="white-text textshadow">esqueci a senha</a>
    </div>