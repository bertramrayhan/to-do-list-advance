<?php 
require_once 'koneksi.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

function returnMessage(bool $isSuccess, string $message) {
    return json_encode(['success' => $isSuccess, 'message' => $message]);
}

function validateInput(string $username, string $password) {
    if(mb_strlen($username) < 4){
        echo returnMessage(false, 'Username minimal 4 karakter');
        exit;
    }else if(mb_strlen($username) > 50){
        echo returnMessage(false, 'Username maksimal 25 karakter');
        exit;
    }else if(!preg_match('/^[a-zA-Z0-9_\.]+$/', $username)){
        echo returnMessage(false, 'Username hanya boleh menggunakan abjad (a-z), angka, garis bawah (_), dan titik (.)');
        exit;
    }
    if(mb_strlen($password) < 8){
        echo returnMessage(false, 'Password minimal 8 karekter');
        exit;
    }else if(mb_strlen($password) > 50){
        echo returnMessage(false, 'Password maksimal 50 karakter');
        exit;
    }
}

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    exit;
}else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $request = file_get_contents('php://input');

    $registerInput = json_decode($request, true);
    
    if(!isset($registerInput['username']) || !isset($registerInput['password'])){
        echo returnMessage(false, 'Data register tidak lengkap');
        exit;
    }
    
    $username = $registerInput['username'];
    $password = $registerInput['password'];

    //VALIDASI INPUT
    validateInput($username, $password);

    if(checkSameData($conn, $username)){
        echo returnMessage(false, 'Username sudah digunakan');
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $newIdUser = generateNewId($conn, 'id_user', 'users', 'usr', 2);

    $query = 'INSERT INTO users (id_user, username, password) VALUES (?,?,?)';
    $statement = $conn->prepare($query);
    $statement->bind_param('sss', $newIdUser, $username, $hashedPassword);

    if($statement->execute()){
        echo returnMessage(true, 'Data berhasil disimpan');
    }else {
        echo returnMessage(false, 'Data tidak berhasil disimpan, coba lagi');
    }
}
?>