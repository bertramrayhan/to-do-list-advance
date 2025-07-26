<?php
require 'util.php'; 

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

handlePreflightRequest();

session_start();

//AGAR SCRIPT HANYA MENERIMA METHOD GET
if(!checkRequestMethod('GET')){exit;}

if(isset($_SESSION['username']) && !empty($_SESSION['username'])){
    echo json_encode([
        'loggedIn'=> true,
        'username'=> $_SESSION['username']
    ]);
}else {
    echo json_encode([
        'loggedIn'=> false,
        'username'=> ''
    ]);
}
?>