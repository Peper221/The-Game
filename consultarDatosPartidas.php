<?php
$servername = "localhost:3307";
$username = "root";
$password = "admin";
$dbname = "puntajesthegame";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Realiza la consulta para obtener los mejores 50 puntajes
$query = "SELECT * FROM partidas ORDER BY puntaje ASC LIMIT 50";
$result = $conn->query($query);

$puntajes = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $puntajes[] = array(
            'posicion' => $row['posicion'],
            'nombre' => $row['nombre'],
            'vecesJugadas' => $row['veces_jugadas'],
            'puntaje' => $row['puntaje']
        );
    }
}

// Devuelve los puntajes en formato JSON
echo json_encode($puntajes);

$conn->close();
?>
