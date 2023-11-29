 
// Variables para controlar la paginación
let currentPage = 1; // Página actual
const itemsPerPage = 10; // Cantidad de posiciones por página
let totalData = []; //para almacenar todos los datos

const buscadorInput = document.getElementById('buscador');

buscadorInput.addEventListener('input', () => {
    const filtroNombre = buscadorInput.value.trim();
    cargarDatosPagina(currentPage, filtroNombre);
});

// Función para cargar y mostrar los datos de la página actual
// Función para cargar y mostrar los datos de la página actual
function cargarDatosPagina(pagina, filtroNombre) {
    totalData.sort((a, b) => a.posicion - b.posicion);

    // Calcula el rango de posiciones para la página actual
    let startPosition = (pagina - 1) * itemsPerPage;
    const endPosition = pagina * itemsPerPage;
    (startPosition % 10 === 0) ? startPosition = startPosition + 1 : startPosition = startPosition;

    console.log(totalData);
    // Filtra los datos para obtener las posiciones en el rango actual
    const datosFiltrados = filtroNombre
    ? totalData.filter(puntaje => puntaje.nombre.toLowerCase().includes(filtroNombre.toLowerCase()))
    : totalData;
        console.log('Datos filtrados:', datosFiltrados);

    const paginatedData = datosFiltrados.filter(puntaje => puntaje.posicion >= startPosition && puntaje.posicion <= endPosition);
    console.log('Datos paginados:', paginatedData); 
    // Agrupa los jugadores con la misma posición
    const groupedData = [];
    let currentGroup = null;

    paginatedData.forEach(puntaje => {
        if (currentGroup && currentGroup.posicion === puntaje.posicion) {
            currentGroup.nombres.push({ nombre: puntaje.nombre, vecesJugadas: puntaje.vecesJugadas, puntaje: puntaje.puntaje, semilla: puntaje.semilla, dificultad: puntaje.dificultad });
        } else {
            currentGroup = { posicion: puntaje.posicion, nombres: [{ nombre: puntaje.nombre, vecesJugadas: puntaje.vecesJugadas, puntaje: puntaje.puntaje, semilla: puntaje.semilla, dificultad: puntaje.dificultad }] };
            groupedData.push(currentGroup);
        }
    });

    // Obtener la tabla donde se mostrarán los puntajes
    const tablaPuntajes = document.getElementById('tabla-puntajes').getElementsByTagName('tbody')[0];

    // Borra cualquier contenido previo en la tabla
    tablaPuntajes.innerHTML = '';

    // Procesa los datos y construye la tabla
    groupedData.forEach(group => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${group.posicion}</td>
            <td>${group.nombres.map(jugador => `${jugador.nombre} (semilla: ${jugador.semilla} , jugada : ${jugador.vecesJugadas} veces)`).join(', ')}</td>
            <td>${group.nombres[0].puntaje}</td>
            <td>${group.nombres[0].dificultad}</td>
        `;
        tablaPuntajes.appendChild(fila);
    });

    // Actualiza el paginador
    actualizarPaginador(filtroNombre);
}

// Función para actualizar el paginador
function actualizarPaginador(filtroNombre) {
    // Calcula el número total de páginas basado en la cantidad de posiciones
    const totalPages = Math.ceil(totalData[totalData.length - 1].posicion / itemsPerPage);

    // Obtener el elemento del paginador
    const paginador = document.getElementById('paginador');
    paginador.innerHTML = '';

    if (totalPages > 1) {
        // Agrega los números de página
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-link');

            // Agrega o quita la clase 'active' al botón de paginación según la página actual
            if (i === currentPage) {
                pageButton.classList.add('active');
            } else {
                pageButton.classList.remove('active');
            }

            pageButton.addEventListener('click', () => {
                currentPage = i;
                cargarDatosPagina(currentPage);
            });
            paginador.appendChild(pageButton);
        }
    }
}

// Llama a la función para obtener y mostrar los puntajes cuando la página se carga
window.addEventListener('load', () => {
    // Realiza una solicitud al servidor para obtener todos los puntajes
    fetch('consultarDatosPartidas.php')
        .then(response => response.json())
        .then(data => {
            // Almacena todos los datos en totalData
            totalData = data;
            // Carga y muestra los datos de la página actual
            cargarDatosPagina(currentPage);
        })
        .catch(error => {
            console.error('Error al obtener los puntajes:', error);
        });
});