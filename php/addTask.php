<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

handlePreflightRequest();

session_start();

if(!checkIdUser()){exit;}

if(!checkRequestMethod('POST')){exit;}

$request = file_get_contents('php://input');
$data = json_decode($request, true);
if(!checkDataIfEmpty($data)){exit;}

trimDatas($data);
$newIdTask = generateNewId($conn, 'id_task', 'tasks', 'task', 3);
$currentIdUser = $_SESSION['id_user'];
$title = $data['title'];
$description = $data['description'];

$query = 'INSERT INTO tasks (id_task, id_user, title, description) VALUES (?,?,?,?)';
$statement = $conn->prepare($query);
$statement->bind_param('ssss', $newIdTask, $currentIdUser, $title, $description);
$statement->execute();

if($statement->affected_rows > 0){
    echo returnMessage(true, 'Task berhasil ditambahkan!');
}else{
    echo returnMessage(false, 'Task gagal ditambahkan');
}

$statement->close();
$conn->close();
?>