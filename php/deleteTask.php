<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

if(!isset($_SESSION['id_user'])){
    http_response_code(401); // unauthorized
    echo returnMessage(false, 'Akses ditolak. Silahkan login terlebih dahulu');
    exit;
}

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405); //method not allowed
    echo returnMessage(false, 'Method tidak diizinkan');
    exit;
}

$request = file_get_contents('php://input');
$data = json_decode($request, true);
if(!isset($data['idTask']) || empty($data['idTask'])){
    echo returnMessage(false, 'Id task kosong');
    exit;
}

$currentIdUser = $_SESSION['id_user'];
$idTask = $data['idTask'];

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