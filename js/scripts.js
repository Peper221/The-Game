// Función para obtener y mostrar los puntajes
function obtenerPuntajes() {
    // Realiza una solicitud al servidor para obtener los puntajes
    fetch('consultarDatosPartidas.php')
      .then(response => response.json())
      .then(data => {
        // Obtén la tabla donde se mostrarán los puntajes
        const tablaPuntajes = document.getElementById('tabla-puntajes');
        
  
        // Variables para rastrear la posición actual y el puntaje actual
        let posicionActual = null;
        let puntajeActual = null;
        let nombres = [];
  
        // Procesa los datos y construye la tabla
        data.forEach(puntaje => {
          if (puntaje.posicion !== posicionActual) {
            // Agrega una fila para mostrar los nombres y puntaje de la posición actual
            if (posicionActual !== null) {
              const fila = document.createElement('tr');
              fila.innerHTML = `
                <td>${posicionActual}</td>
                <td>${nombres.join(', ')}</td>
                <td>${puntajeActual}</td>
              `;
              tablaPuntajes.appendChild(fila);
            }
  
            // Inicializa nombres, puntaje y actualiza la posición actual
            nombres = [`${puntaje.nombre} (${puntaje.vecesJugadas})`];
            puntajeActual = puntaje.puntaje;
            posicionActual = puntaje.posicion;
          } else {
            // Agrega el nombre actual al array de nombres
            nombres.push(`${puntaje.nombre} (${puntaje.vecesJugadas})`);
          }
        });
  
        // Agrega la última fila
        if (posicionActual !== null) {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${posicionActual}</td>
            <td>${nombres.join(', ')}</td>
            <td>${puntajeActual}</td>
          `;
          tablaPuntajes.appendChild(fila);
        }
      })
      .catch(error => {
        console.error('Error al obtener los puntajes:', error);
      });
  }
  
  // Llama a la función para obtener y mostrar los puntajes cuando la página se carga
  window.addEventListener('load', obtenerPuntajes);
  