<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

if(!checkIdUser()){exit;}

if(!checkRequestMethod('GET')){exit;}

$currentIdUser = $_SESSION['id_user'];

$query = 'SELECT id_task, title, description, status FROM tasks WHERE id_user =?';
$statement = $conn->prepare($query);
$statement->bind_param('s', $currentIdUser);
$statement->execute();

$result = $statement->get_result();
if($result->num_rows > 0){
    $tasks = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode([
        'success'=> true,
        'tasks'=> $tasks
    ]);
}else {
    echo json_encode([
        'success'=> true,
        'tasks'=> []
    ]);
}

$statement->close();
?>