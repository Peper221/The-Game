<?php
 
$servername = "localhost:3307";
$username = "root";
$password = "admin";
$dbname = "puntajesthegame";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

$nombre = $_POST['nombre'];
$semilla = $_POST['semilla'];
$vecesJugadas = $_POST['vecesJugadas'];
$puntaje = $_POST['puntaje'];

// Inserta la partida en la base de datos
$sql = "INSERT INTO partidas (nombre, semilla, veces_jugadas, puntaje) VALUES ('$nombre', '$semilla', '$vecesJugadas', '$puntaje')";

if ($conn->query($sql) === TRUE) {
    echo "Datos de la partida guardados con éxito.";
    
         // Actualiza las posiciones en función del puntaje, teniendo en cuenta los empates
    $query = "SELECT id, puntaje FROM partidas ORDER BY puntaje ASC";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $posicion = 1;
        $prevPuntaje = null;
        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $puntajeActual = $row['puntaje'];

            if ($prevPuntaje !== null && $puntajeActual > $prevPuntaje) {
                $posicion++;
            }

            $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
            if ($conn->query($updateSql) === TRUE) {
                $prevPuntaje = $puntajeActual;
            }
        }
        echo "Posición actualizada.";
    }
} else {
    echo "Error al guardar los datos: " . $conn->error;
}

$conn->close();


?>
