<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

if(!checkIdUser()){exit;}

if(!checkRequestMethod('POST')){exit;}

$request = file_get_contents('php://input');
$data = json_decode($request, true);
if(!checkDataIfEmpty($data)){exit;}

trimDatas($data);
$currentIdUser = $_SESSION['id_user'];
$idTask = $data['idTask'];
$statusTask = $data['statusTask'] ? 1 : 0;

$query = 'UPDATE tasks SET status=? WHERE id_user=? AND id_task=?';
$statement = $conn->prepare($query);
$statement->bind_param('iss', $statusTask, $currentIdUser, $idTask);
$statement->execute();

if($statement->affected_rows > 0){
    echo returnMessage(true, 'Status task berhasil diubah');
}else {
    echo returnMessage(false, 'Status task gagal diubah');
}

$statement->close();
$conn->close();
?>