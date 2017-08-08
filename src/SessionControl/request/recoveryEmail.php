<?php

//use /EmailControl/Email;

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email) {
//    $send = new Email();
//    $send->setTemplate("SessionControl/view/email/recoveryEmail");
//    $send->sendEmail($email);
}