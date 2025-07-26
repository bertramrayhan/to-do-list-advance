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
$idTask = $data['idTask'];
$currentIdUser = $_SESSION['id_user'];
$title = $data['title'];
$description = $data['description'];

$query = 'UPDATE tasks SET title=?, description=? WHERE id_task=? AND id_user=?';
$statement = $conn->prepare($query);
$statement->bind_param('ssss', $title, $description, $idTask, $currentIdUser);
$statement->execute();

if($statement->affected_rows > 0){
    echo returnMessage(true, 'Task berhasil diperbarui!');
}else{
    echo returnMessage(false, 'Task gagal diperbarui');
}

$statement->close();
$conn->close();
?>