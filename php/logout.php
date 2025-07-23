<?php 
require 'util.php'; 
session_start();

//AGAR SCRIPT HANYA MENERIMA METHOD GET
if($_SERVER['REQUEST_METHOD'] !== 'GET'){
    http_response_code(405);
    echo returnMessage(false, "Method tidak diizinkan.");
    exit;
}

$_SESSION = array();

session_destroy();

echo returnMessage(true, 'Logout');
exit;
?>