<?php
    $host = "localhost";
    $user = "root";
    $password = "root";
    $database = "task_manager";

    $conn = new mysqli($host, $user, $password, $database);

    if($conn->connect_error){
        die("Koneksi gagal: " . $conn->connect_error);
    }

    function generateNewId($conn, string $column, string $table, string $prefix, int $lenNum) : string{
        $query = "SELECT $column FROM $table ORDER BY $column DESC LIMIT 1";
        $result = $conn->query($query);
        
        if($result->num_rows > 0){
            $row = $result->fetch_assoc();

            $prefixLen = strlen($prefix);
            $angkaLama = (int) substr($row[$column], $prefixLen);
            $idBaru = $prefix . sprintf("%0{$lenNum}d", $angkaLama + 1);
        } else {
            $idBaru = $prefix . sprintf("%0{$lenNum}d", 1);
        }

        return $idBaru;
    }

    function checkSameData($conn, string $username) : bool{
        $query = "SELECT id_user FROM users WHERE username = ?";
        $statement = $conn->prepare($query);
        $statement->bind_param('s', $username);
        $statement->execute();

        $result = $statement->get_result();

        if($result->num_rows > 0){
            return true;
        }

        return false;
    }
?>