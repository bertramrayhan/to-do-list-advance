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

$currentIdUser = $_SESSION['id_user'];
$idTask = trim($data['idTask']);

$query = 'DELETE FROM tasks WHERE id_user =? AND id_task=?';
$statement = $conn->prepare($query);
$statement->bind_param('ss', $currentIdUser, $idTask);
$statement->execute();

if($statement->affected_rows > 0){
    echo returnMessage(true, 'Task berhasil dihapus');
}else {
    echo returnMessage(false, 'Task gagal dihapus');
}

$statement->close();
$conn->close();
?>