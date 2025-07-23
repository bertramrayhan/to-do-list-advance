<?php
require 'util.php'; 
session_start();

//AGAR SCRIPT HANYA MENERIMA METHOD GET
if($_SERVER['REQUEST_METHOD'] !== 'GET'){
    http_response_code(405);
    echo returnMessage(false, "Method tidak diizinkan.");
    exit;
}

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