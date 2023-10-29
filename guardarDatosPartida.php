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
$puntaje = $_POST['puntaje'];

// Verificar si el puntaje supera el récord de la posición 50
$sqlMax50 = "SELECT puntaje FROM partidas WHERE posicion = 50 ORDER BY puntaje ASC";
$resultMax50 = $conn->query($sqlMax50);

if ($resultMax50->num_rows > 0) {
    $rowMax50 = $resultMax50->fetch_assoc();
    $minPuntaje = $rowMax50['puntaje'];

    if ($puntaje < $minPuntaje) {
          // Verificar si ya existe un registro con el mismo usuario y semilla
        $sqlExistingRecord = "SELECT id, puntaje FROM partidas WHERE nombre = '$nombre' AND semilla = '$semilla'";
        $resultExistingRecord = $conn->query($sqlExistingRecord);

        if ($resultExistingRecord->num_rows > 0) {
            $rowExistingRecord = $resultExistingRecord->fetch_assoc();
            $puntajeActual = $rowExistingRecord['puntaje'];
        
            if ($puntaje < $puntajeActual) {
                // La nueva puntuación es mejor, actualiza el registro existente
                $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
                $updateData = "UPDATE partidas SET puntaje = $puntaje, veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
                $conn->query($updateData);
                echo "Puntuación actualizada con éxito.";
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
                $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
                $updateData = "UPDATE partidas SET veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
                $conn->query($updateData);
                echo "Veces jugadas actualizada con éxito.";
            }
        }
    } else {
        echo "El puntaje no supera el récord de la posición 50.";
    }
} else {

    // Verificar si ya existe un registro con el mismo usuario y semilla
    $sqlExistingRecord = "SELECT id, puntaje FROM partidas WHERE nombre = '$nombre' AND semilla = '$semilla'";
    $resultExistingRecord = $conn->query($sqlExistingRecord);

if ($resultExistingRecord->num_rows > 0) {
    $rowExistingRecord = $resultExistingRecord->fetch_assoc();
    $puntajeActual = $rowExistingRecord['puntaje'];

    if ($puntaje < $puntajeActual) {
        // La nueva puntuación es mejor, actualiza el registro existente
        $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
        $updateData = "UPDATE partidas SET puntaje = $puntaje, veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
        $conn->query($updateData);
        echo "Puntuación actualizada con éxito.";
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
        $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
        $updateData = "UPDATE partidas SET veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
        $conn->query($updateData);
        echo "Veces jugadas actualizada con éxito.";
    }
} else {
    // Insertar la partida en la base de datos
    $sql = "INSERT INTO partidas (nombre, semilla, puntaje) VALUES ('$nombre', '$semilla', '$puntaje')";
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
}
       
}

$conn->close();


?>
