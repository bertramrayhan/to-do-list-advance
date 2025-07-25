<?php 
require 'koneksi.php';
require 'util.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if($_SERVER['REQUEST_METHOD'] === 'OPTIONS'){
    exit;
}else if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $request = file_get_contents('php://input');

    $loginInput = json_decode($request, true);

    foreach ($loginInput as $key => $value) {
        if (!isset($value) || (is_string($value) && trim($value) === "")) {
            echo returnMessage(false, 'Data login tidak lengkap');
            exit;
        }
    }
    
    trimDatas($loginInput);
    $username = $loginInput['username'];
    $password = $loginInput['password'];

    //VALIDASI INPUT
    validateInput($username, $password);

    //CEK APAKAH DATA LOGIN ADA
    $query = 'SELECT id_user, password FROM users WHERE username = ?';
    $statement = $conn->prepare($query);
    $statement->bind_param('s', $username);
    $statement->execute();

    $result = $statement->get_result();
    if($result->num_rows > 0){
        $row = $result->fetch_assoc();
        $passwordFromDatabase = $row['password'];

        if(password_verify($password, $passwordFromDatabase)){
            session_start();
            session_regenerate_id(true);

            session_unset();

            $_SESSION['id_user'] = $row['id_user'];
            $_SESSION['username'] = $username;

            echo returnMessage(true, 'Login berhasil');
        }else{
            echo returnMessage(false, 'Username atau Password salah');
        }
    }else{
        echo returnMessage(false, 'Username atau Password salah');
    }

    $statement->close();
    $conn->close();
}
?>