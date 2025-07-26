<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

handlePreflightRequest();

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $request = file_get_contents('php://input');

    $registerInput = json_decode($request, true);

    foreach ($registerInput as $key => $value) {
        if (!isset($value) || (is_string($value) && trim($value) === "")) {
            echo returnMessage(false, 'Data register tidak lengkap');
            exit;
        }
    }
    
    trimDatas($registerInput);
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

    $statement->close();
    $conn->close();
}
?>