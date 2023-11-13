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
$vecesjugadas = $_POST['vecesJugadas'];
$puntaje = $_POST['puntaje'];
$dificultad = $_POST['dificultad'];

// Verificar si el puntaje supera el récord de la posición 50
$sqlMax50 = "SELECT puntaje FROM partidas WHERE posicion = 50 ORDER BY puntaje ASC";
$resultMax50 = $conn->query($sqlMax50);

if ($resultMax50->num_rows > 0) {
    $rowMax50 = $resultMax50->fetch_assoc();
    $minPuntaje = $rowMax50['puntaje'];

    if ($puntaje < $minPuntaje) {
          // Verificar si ya existe un registro con el mismo usuario y semilla
        $sqlExistingRecord = "SELECT * FROM partidas WHERE nombre = '$nombre' AND semilla = '$semilla'";
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
                 // Actualiza las posiciones en función del puntaje
                $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
                $result = $conn->query($query);
                    
                if ($result->num_rows > 0) {
                    $posicion = 1;
                        while ($row = $result->fetch_assoc()) {
                            $id = $row['id'];
                            $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
                            $conn->query($updateSql);
                            $posicion++;
                         }
                        echo "Posición actualizada.";
                     }
                    
            } else {
                $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
                $updateData = "UPDATE partidas SET veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
                $conn->query($updateData);
                echo "Veces jugadas actualizada con éxito.";

                $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
                $result = $conn->query($query);
        
                if ($result->num_rows > 0) {
                $posicion = 1;
                while ($row = $result->fetch_assoc()) {
                    $id = $row['id'];
                    $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
                    $conn->query($updateSql);
                    $posicion++;
                }
                echo "Posición actualizada.";
                }
            }
        }  else {
            // Insertar la partida en la base de datos
            $sql = "INSERT INTO partidas (nombre, semilla, veces_jugadas, puntaje, dificultad) VALUES ('$nombre', '$semilla', $vecesjugadas,'$puntaje', $dificultad)";
            if ($conn->query($sql) === TRUE) {
                echo "Datos de la partida guardados con éxito.";
        
                // Actualiza las posiciones en función del puntaje
                $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
                $result = $conn->query($query);
        
                if ($result->num_rows > 0) {
                $posicion = 1;
                while ($row = $result->fetch_assoc()) {
                    $id = $row['id'];
                    $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
                    $conn->query($updateSql);
                    $posicion++;
                }
                echo "Posición actualizada.";
                }
            } else {
                echo "Error al guardar los datos: " . $conn->error;
            }
        }
    } else {
        echo "El puntaje no supera el récord de la posición 50.";
    }
} else {

    // Verificar si ya existe un registro con el mismo usuario y semilla
    $sqlExistingRecord = "SELECT * FROM partidas WHERE nombre = '$nombre' AND semilla = '$semilla'";
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
        // Actualiza las posiciones en función del puntaje
        $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            $posicion = 1;
            while ($row = $result->fetch_assoc()) {
                $id = $row['id'];
                $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
                $conn->query($updateSql);
                $posicion++;
            }
             echo "Posición actualizada.";
        }
         
    } else {
        $nuevasVecesJugadas = $rowExistingRecord['veces_jugadas'] + 1;
        $updateData = "UPDATE partidas SET veces_jugadas = $nuevasVecesJugadas WHERE id = " . $rowExistingRecord['id'];
        $conn->query($updateData);
        echo "Veces jugadas actualizada con éxito.";
        
        $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
        $posicion = 1;
        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
            $conn->query($updateSql);
            $posicion++;
        }
        echo "Posición actualizada.";
        }
    }
} else {
    // Insertar la partida en la base de datos
    $sql = "INSERT INTO partidas (nombre, semilla, veces_jugadas, puntaje, dificultad) VALUES ('$nombre', '$semilla', $vecesjugadas,'$puntaje', $dificultad)";
    if ($conn->query($sql) === TRUE) {
        echo "Datos de la partida guardados con éxito.";

        // Actualiza las posiciones en función del puntaje
        $query = "SELECT id, puntaje, veces_jugadas FROM partidas ORDER BY puntaje ASC, veces_jugadas ASC";
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
        $posicion = 1;
        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $updateSql = "UPDATE partidas SET posicion = $posicion WHERE id = $id";
            $conn->query($updateSql);
            $posicion++;
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