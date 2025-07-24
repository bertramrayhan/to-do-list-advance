<?php
require 'secret.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$conn = new mysqli($host, $user, $password, $database);

if($conn->connect_error){
    die("Koneksi gagal: " . $conn->connect_error);
}
?>