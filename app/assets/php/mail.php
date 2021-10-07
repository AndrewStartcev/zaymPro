<?php
// Файлы phpmailer
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
require 'phpmailer/Exception.php';

// Переменные, которые отправляет пользователь

if (!empty($_POST['theme'])) {
  $theme = $_POST['theme'];
  $text_theme = "<b>Тема: </b> $theme <br>";
}
if (!empty($_POST['user_name'])) {
  $name = $_POST['user_name'];
  $text_name = "<b>Имя: </b> $name <br>";
}
if (!empty($_POST['user_tel'])) {
  $tel = $_POST['user_tel'];
  $text_tel = "<b>Номер телефона: </b> $tel <br>";
}

// Формирование самого письма
$title = "Новая заявка с сайта";
$body = "
$text_theme
$text_name
$text_tel
<br>
--
Это сообщение отправлено с сайта .
";

// Настройки PHPMailer
$mail = new PHPMailer\PHPMailer\PHPMailer();
try {
		$mail->isSMTP();
    $mail->CharSet = "UTF-8";
    $mail->SMTPAuth   = true;
    // $mail->SMTPDebug = 2;
    $mail->Debugoutput = function($str, $level) {$GLOBALS['status'][] = $str;};

    // Настройки вашей почты
		$mail->Host = 'smtp.mail.ru';
		$mail->SMTPSecure = 'ssl';
		$mail->Port = 465;
    $mail->Username   = 'dev.site.send@mail.ru'; // Логин на почте
    $mail->Password   = '1Ge8lwAiIedXquEUvUq4'; // Пароль на почте
    $mail->setFrom('dev.site.send@mail.ru', 'Сайт БетонГрупп'); // Адрес самой почты и имя отправителя

    // Получатель письма
    $mail->addAddress('andrewstarcevmarty@gmail.com');

// Отправка сообщения
$mail->isHTML(true);
$mail->Subject = $title;
$mail->Body = $body;

// Проверяем отравленность сообщения
if ($mail->send()) {$result = "success";}
	else {$result = "error";}
} catch (Exception $e) {
    $result = "error";
    $status = "Сообщение не было отправлено. Причина ошибки: {$mail->ErrorInfo}";
}

// Отображение результата
echo json_encode(["result" => $result, "resultfile" => $rfile, "status" => $status]);
