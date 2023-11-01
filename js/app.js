
    let cartaSeleccionada = null;
    const btnTurno = document.querySelector('#btnTurno');
    const btnDeshacer = document.querySelector('#btnDeshacer');
    let movimientosDuranteTurno = []; // Arreglo para almacenar los movimientos
    let inicioPartida = true;
    let mazo = [];
    let barajado = [];
    let mano = [];
    let semilla;
    let usuario;

    let superior1 = [];
    let superior2 = [];
    let inferior1 = [];
    let inferior2 = [];

    function seleccionarCarta(carta) {
        if (cartaSeleccionada === carta) {
            // Si se hace clic en la misma carta dos veces, deseleccionarla
            carta.style.border = "none"; // Restaura el borde
            cartaSeleccionada = null; // Reinicia la variable de selección
        } else if (cartaSeleccionada === null && !["superior1", "superior2", "inferior1", "inferior2"].includes(carta.parentNode.id)) {
            // Si no hay una carta seleccionada, selecciona esta
            cartaSeleccionada = carta;
            carta.style.border = "2px solid red"; // Cambia el borde para indicar selección
        } else {
            // Si ya hay una carta seleccionada, intenta moverla a este espacio carta
            moverCarta(carta);
        }
    }
    
    function moverCarta(espacioCarta) {
        if (cartaSeleccionada !== null && cartaSeleccionada !== espacioCarta) {
            const carta = {
                'numero' : parseInt(cartaSeleccionada.dataset.numero),
                'img' : cartaSeleccionada.dataset.numero
            };
                    
            // Obtener el id del elemento padre de espacioCarta
            const espacioId = espacioCarta.parentNode.id;
            // Verificar si el espacioCarta es superior1, superior2, inferior1 o inferior2
            if (espacioId === "superior1" || espacioId === "superior2" || espacioId === "inferior1" || espacioId === "inferior2") {
              
                if (validarMovimiento(cartaSeleccionada, espacioId)) {

                        eliminarCartaDeArreglo(cartaSeleccionada.parentNode, cartaSeleccionada);
                        // Registra el movimiento en el arreglo
                         movimientosDuranteTurno.push(carta);
                        if(cartaSeleccionada.parentNode && cartaSeleccionada.parentNode.id.startsWith('mano')){
                            const padreCartaSeleccionada = cartaSeleccionada.parentNode;
                            const columna = padreCartaSeleccionada.parentNode;
                            
                            padreCartaSeleccionada.removeChild(cartaSeleccionada);
                            padreCartaSeleccionada.style.display = 'none';
               
                            // Obtiene todos los hijos de columna
                            var hijos = columna.children;

                            // verificar si todos los hijos tienen "display: none"
                            var todosTienenDisplayNone = true;

                            var primerHijo = columna.firstChild.nextElementSibling; //primer hijo de columna
                        
                            // Verificar si el elemento a eliminar es el primer hijo
                            if (primerHijo === padreCartaSeleccionada) {
                                
                                // Obtener el segundo elemento en la columna (si existe)
                                const segundoElemento = columna.querySelector('.espacio-carta:nth-child(2)');
                                if (segundoElemento) {
                                    // Ajustar el valor de top del segundo elemento
                                    segundoElemento.style.top = '0px';
                                }
                            } 



                            // Itera a través de los hijos y verifica el atributo "display"
                            for (var i = 0; i < hijos.length; i++) {
                            var estilo = window.getComputedStyle(hijos[i]);
                            if (estilo.display !== "none") {
                                todosTienenDisplayNone = false;
                                break; // Si uno de los hijos no tiene "display: none", ya no es necesario verificar los demás
                            }
                            }

                            // Ahora, puedes comprobar el valor de "todosTienenDisplayNone"
                            if (todosTienenDisplayNone) {
                                columna.style.display = 'none';
                            } else {
                             // Cambiar el atributo CSS grid-template-columns de 2fr a 1fr
                             columna.style.gridTemplateColumns = '1fr';
                             columna.style.marginRight = '0';
                             columna.style.maxWidth = '97px';
                            }
                              
                        }

                        cartaSeleccionada = null; // Reinicia la variable
                        // Agregar carta al arreglo correspondiente
                        switch (espacioId) {
                            case "superior1":
                                superior1.push(carta);
                                actualizarHTML(superior1, espacioId);
                                break;
                            case "superior2":
                                superior2.push(carta);
                                actualizarHTML(superior2, espacioId);
                                break;
                            case "inferior1":
                                inferior1.push(carta);
                                actualizarHTML(inferior1, espacioId);
                                break;
                            case "inferior2":
                                inferior2.push(carta);
                                actualizarHTML(inferior2, espacioId);
                                break;
                        }

                        verificarMovimientosCompatiblesEnPilas();
                } else {
                    cartaSeleccionada.style.border = 'none';
                    cartaSeleccionada = null; // para evitar doble llamado del alert
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.addEventListener('mouseenter', Swal.stopTimer)
                          toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                      })
                      
                      Toast.fire({
                        icon: 'warning',
                        title: 'Movimiento inválido'
                      })
                }
                
            }

        }
    }
            
    function validarMovimiento(carta, espacioId) {
         let numeroCarta;

            if (carta instanceof HTMLElement) {
                // Si carta es un objeto div, obtener el número del dataset
                numeroCarta = carta.dataset.numero;

            } else {
                numeroCarta = carta.numero;
            }

        // Verifica si el espacio es superior1 o superior2
        if (espacioId === "superior1" || espacioId === "superior2") {
            // Verifica si la carta que deseas mover es menor que la última carta en superior1 o superior2
            const ultimaCartaSuperior = espacioId === "superior1" ? superior1[superior1.length - 1] : superior2[superior2.length - 1];
            
            if(!ultimaCartaSuperior){
                return true;
            }

            // Para verificar si la diferencia es de 10
            if ( (numeroCarta - ultimaCartaSuperior.numero ) == 10) {
                return true;
            }

            if (numeroCarta > ultimaCartaSuperior.numero) {
                 
                // La carta no puede ser colocada en este espacio superior
                return false;
            }

        }
        // Verifica si el espacio es inferior1 o inferior2
        else if (espacioId === "inferior1" || espacioId === "inferior2") {
            // Verifica si la carta que deseas mover es mayor que la última carta en inferior1 o inferior2
            const ultimaCartaInferior = espacioId === "inferior1" ? inferior1[inferior1.length - 1] : inferior2[inferior2.length - 1];

            if(!ultimaCartaInferior){

                return true;
            }

            // Para verificar si la diferencia es de 10
            if (  ( ultimaCartaInferior.numero - numeroCarta) == 10) {
                return true;
            }

            if (numeroCarta < ultimaCartaInferior.numero) {
                // La carta no puede ser colocada en este espacio inferior
                return false;
            }

        }  
        return true;
    }

    function actualizarHTML(arreglo, espacio){

        // Obtén el espacio correspondiente por su id
        const espacioDiv = document.querySelector(`#${espacio}`);
        // Elimina todas las cartas HTML anteriores en el espacio
        const cartasAnteriores = espacioDiv.querySelectorAll('.clase');
        cartasAnteriores.forEach((cartaHTML) => {
            espacioDiv.removeChild(cartaHTML);
        });

        // Obtén la última carta en el arreglo
        const carta = arreglo[arreglo.length - 1];

        if(carta){
            // Crea un elemento de carta HTML y agrega la información

            const cartaHTML = crearCartaHTML(carta);
            cartaHTML.classList.add('clase');

            // Agrega la carta como hijo del espacio correspondiente
            espacioDiv.appendChild(cartaHTML);

        }
        
    }
    
    function eliminarCartaDeArreglo(origen, carta){
        
        arreglo = origen.id;
        if(arreglo.startsWith('mano')){
            eliminarCartaDeArregloInterno(mano, carta);
                // Comprobar cuántas cartas quedan en la mano
            const cartasEnMano = mano.length;
            // Habilitar o deshabilitar el botón según la cantidad de cartas en la mano
            btnTurno.disabled = cartasEnMano > 6;
            btnDeshacer.disabled = cartasEnMano > 7;
 
        } else {
        switch (arreglo) {
            case "superior1":
                eliminarCartaDeArregloInterno(superior1, carta);
                actualizarHTML(superior1, carta.parentNode.id);
                break;
            case "superior2":
                eliminarCartaDeArregloInterno(superior2, carta);
                actualizarHTML(superior2, carta.parentNode.id);
  
                break;
            case "inferior1":
                eliminarCartaDeArregloInterno(inferior1, carta);
                actualizarHTML(inferior1, carta.parentNode.id);
 
                break;
            case "inferior2":
                eliminarCartaDeArregloInterno(inferior2, carta);
                actualizarHTML(inferior2, carta.parentNode.id);
                break;
            
         }

    

        }

    }

    function eliminarCartaDeArregloInterno(arreglo, carta) {
        for (let i = 0; i < arreglo.length; i++) {
            
            if(arreglo[i].numero == parseInt(carta.dataset.numero)){
                arreglo.splice(i, 1);
                break;
            }
            
        }
    }

    function moverDesdeSuperior(espacio) {
        // Lógica para mover cartas desde el superior a otros lugares
        carta  = espacio.lastElementChild;
        if(cartaSeleccionada == null && carta.id != 'i100'){
            
        }else { 
            moverCarta(carta); 

        }
        
    }   

    function moverDesdeInferior(espacio) {
        // Lógica para mover cartas desde el inferior a otros lugares
        carta  = espacio.lastElementChild;
        if(cartaSeleccionada == null && carta.id != 'i1'){
            
        }else { 
            moverCarta(carta); 

        }
    }

    function mostrarColumnasEhijos() {
        // Verificar el tamaño de la pantalla utilizando una consulta de medios CSS
        const pantallaGrande = window.matchMedia("(min-width: 845px)").matches;
    
        // Habilitar los espacios en blanco en la mano (mostrarlos)
        for (let i = 1; i < 5; i++) {
            const columna = document.querySelector(`.columna${i}`);
            const hijos = columna.querySelectorAll('.espacio-mano');
    
            // Cambiar el atributo display dependiendo del tamaño de la pantalla
            if (pantallaGrande) {
                columna.style.display = 'grid';
                columna.style.gridTemplateColumns = 'repeat(2, 1fr)';
                columna.style.maxWidth = '200px';
            } else {
                columna.style.display = 'block';
                columna.style.gridTemplateColumns = ''; // Restablecer las columnas para dispositivos pequeños
                columna.style.maxWidth = ''; // Restablecer el ancho máximo para dispositivos pequeños
            }
    
            // Itera a través de los hijos de la columna y cambia su estilo de display a "block"
            for (let j = 0; j < hijos.length; j++) {
                if (hijos[j].style.display == 'none') {
                    hijos[j].style.display = 'block';
                    columna.style.gridTemplateColumns = 'repeat(2, 1fr)';
                    columna.style.maxWidth = '200px';
                }
    
                // Restaura el atributo top del segundo hijo de la columna
                if (j === 1) {
                    const segundoElemento = columna.querySelector('.espacio-carta:nth-child(2)');
                    if (segundoElemento) {
                        segundoElemento.style.top = '-130px'; // Restaura el valor original
                    }
                }
            }
        }
    }

    // Función para manejar cambios en la resolución
    function cambiarDisplayDeColumnas(mediaQuery) {
        if (mediaQuery.matches) {
            // Pantalla es más grande que 844px
            for (let i = 1; i < 5; i++) {
                const columna = document.querySelector(`.columna${i}`);  
                
                if (columna.style.display === 'grid') {
                    columna.style.display = 'block';
                }
            }
        } else {
            // Pantalla es más grande que 844px
            for (let i = 1; i < 5; i++) {
                const columna = document.querySelector(`.columna${i}`);  
                
                if (columna.style.display === 'block') {
                    columna.style.display = 'grid';
                }
            }
           
        }
    }    

    // Agrega un listener de media query
        const mediaQuery = window.matchMedia("(max-width: 844px)");
        mediaQuery.addListener(cambiarDisplayDeColumnas);

        // Llamar a la función inicialmente para aplicar los estilos correctos en función de la resolución actual
        cambiarDisplayDeColumnas(mediaQuery)
  
    btnDeshacer.onclick = () => {

        if(cartaSeleccionada != null){
            cartaSeleccionada = null;
        }
 
        // Itera a través de los movimientos registrados durante el turno
        for (const carta of movimientosDuranteTurno) {

            mostrarColumnasEhijos();

                // Encontrar la carta en el arreglo correspondiente y agregarla nuevamente a la mano
                const cartaEnArreglo = encontrarCartaEnArreglo(carta.numero);
                if (cartaEnArreglo) {
                    mano.push(cartaEnArreglo);
                    
                }
       
        }

        actualizarManoHTML();
    
        // Limpia los movimientos registrados durante el turno
        movimientosDuranteTurno.length = 0;
    
        // Vuelve a deshabilitar el botón de deshacer
        btnDeshacer.disabled = true;
    };
    
    function actualizarManoHTML() {
  
        if(mano.length > 0){
             mano.sort((a, b) => a.numero - b.numero);
            for (let i = 0; i < mano.length; i++) {
                const espacioMano = document.getElementById(`mano-${i}`);
                espacioMano.innerHTML = ''; // Limpiar el espacio antes de agregar la carta

                const carta = mano[i];
                const cartaHTML = crearCartaHTML(carta);
                espacioMano.appendChild(cartaHTML);
                
            }
            // Comprobar cuántas cartas quedan en la mano
            const cartasEnMano = mano.length;
            // Habilitar o deshabilitar el botón según la cantidad de cartas en la mano
            btnTurno.disabled = cartasEnMano === 8;
            btnDeshacer.disabled = cartasEnMano === 8;
        } else {
            for (let i = 0; i < 8; i++) {
                const espacioMano = document.getElementById(`mano-${i}`);
                espacioMano.innerHTML = ''; // Limpiar el espacio antes de agregar la carta
            }
        }
    }

    // Función para encontrar una carta en los arreglos
    function encontrarCartaEnArreglo(numeroCarta) {
        for (const [nombre, arreglo] of Object.entries({
            superior1: superior1,
            superior2: superior2,   
            inferior1: inferior1,
            inferior2: inferior2
        })) {
            for (const carta of arreglo) {
                if (carta.numero === parseInt(numeroCarta)) {
                    // Elimina la carta del arreglo correspondiente
                    arreglo.splice(arreglo.indexOf(carta), 1);
                    actualizarHTML(arreglo, nombre);
                    return carta;
                }
            }
        }
        return null;
    }

    //  ---------- TABLERO INICIAL -----------
    function crearMazo() {
        let cartas = [];
         for(let i = 2; i <= 99; i++){
             const carta = {
                 numero : i,
                 img: `${i}`
             }
             cartas.push(carta); 
         }
         return cartas;
     }
     function generarNumeroPseudoAleatorio(semilla) {
        let x = Math.sin(semilla) * 10000;
        return x - Math.floor(x);
    }

     function barajarCartas(mazo, semilla) {
    
        const mazoABarajar = [...mazo];
        let tamañoDeMazo = mazoABarajar.length;
    
        for (let i = tamañoDeMazo - 1; i > 0; i--) {
            const j = Math.floor(generarNumeroPseudoAleatorio(semilla + i) * (i + 1));
            [mazoABarajar[i], mazoABarajar[j]] = [mazoABarajar[j], mazoABarajar[i]];
        }
    
        return mazoABarajar;
    }
    
    function generarSemillaAleatoria() {
        return Math.floor(Math.random() * 10000);  
    }

    function servirCartasEnManoArreglo(){
        // Inicializa el arreglo mano  
    
        mano = [];
        for (let i = 0; i < 8; i++) {
            
            const primeraCartaBarajada = barajado[0];
            barajado.shift();
            mano.push(primeraCartaBarajada);
        }
    }

    function crearCartaHTML (carta){
        //crear carta en HTML
        const cartaHTML = document.createElement("div");
        const imagen = document.createElement('p');
        imagen.classList.add('parrafo');
        cartaHTML.onclick = () => {
            seleccionarCarta(cartaHTML);
        }
        cartaHTML.dataset.numero = carta.numero;
        imagen.innerText = carta.img;
        cartaHTML.appendChild(imagen);
        return cartaHTML;
    }

    function ponerCartasEnManoHTML() {
          
        if(inicioPartida){
                actualizarManoHTML();
                inicioPartida = false;

                return;
        }
            if(cartaSeleccionada != null){
                cartaSeleccionada = null;
            }
 

            // Obtener cuántas cartas hay actualmente en la mano
            const cartasEnMano = mano.length;

            // Calcular cuántas cartas faltan para llenar la mano a 8
            const cartasFaltantes = 8 - cartasEnMano;
           
        
            mostrarColumnasEhijos();

            if (cartasFaltantes > 0) {

                 // Llenar los espacios en blanco con nuevas cartas si hay suficientes en el mazo
                for (let i = 0; i < cartasFaltantes && barajado.length > 0; i++) {
                    // Tomar una carta del mazo barajado
                    const cartaTomada = barajado.shift();
                    // Agregar la carta a la mano
                    mano.push(cartaTomada);
                }

                    actualizarManoHTML();
                     // Comprobar cuántas cartas quedan en la mano
                     const cartasEnMano = mano.length;
                    btnDeshacer.disabled = cartasEnMano === 8;
                    movimientosDuranteTurno = [];
            }
                
             console.log(barajado);
             console.log('barajado ' + barajado.length);
            verificarMovimientosCompatiblesEnPilas();
            guardarDatosDelJuego();
    }

    function verificarMovimientosCompatiblesEnPilas() {
        const cartasEnMano = mano.length;
    
            // Verifica si no puedes jugar ninguna carta en las pilas
            if(cartasEnMano > 6 || barajado.length == 0){
            const ningunaCompatible = mano.every((carta) => {
                return !(
                    validarMovimiento(carta, "superior1") ||
                    validarMovimiento(carta, "superior2") ||
                    validarMovimiento(carta, "inferior1") ||
                    validarMovimiento(carta, "inferior2")
                );
            });
    
            if (ningunaCompatible) {
                let puntaje = mano.length + barajado.length; 

                if(puntaje == 0) {
                    guardarRegistroDePartida(puntaje);
                    localStorage.removeItem('datosDelJuego');
                    AlertaDeJuegoGanado();
                } else {
                    guardarRegistroDePartida(puntaje);
                    localStorage.removeItem('datosDelJuego');
                    AlertaFinDeJuego(puntaje);
                }
            }
         }
    }
     
    function AlertaDeJuegoGanado(){
        Swal.fire({
            title: 'Felicidades, ganaste el juego',
            width: 600,
            padding: '3em',
            color: '#716add',
            background: '#fff url(/images/trees.png)',
            confirmButtonText:
              '<i class="fa fa-thumbs-up">Nuevo Juego</i>',
            backdrop: `
              rgba(0,0,123,0.4)
              url("/img/estrellas.gif")
              center center
              no-repeat
            `
          }).then((result) => {
            if (result.isConfirmed) {
                 location.reload(); // se recarga la página
            }
          });
    }

    function AlertaFinDeJuego(puntaje) {
        Swal.fire({
          title: '<strong>Fin del juego</strong>',
          html: `Tu puntaje es de: <b> ${puntaje}</b> `,
          focusConfirm: false,
          confirmButtonText: '<i class="fa fa-thumbs-up">Salir</i>',
          confirmButtonAriaLabel: 'Thumbs up, great!',
          allowOutsideClick: () => false
        }).then((result) => {
          if (result.isConfirmed) {
             
            window.location.href = '/index.html';
          } else if (result.isDenied) {
             mostrarAlertaSemilla(puntaje);
          }
        });
      }

      function mostrarAlertaSemilla(puntaje) {
        Swal.fire({
          title: 'Ingresar la semilla de juego',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Verificar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: () => false
        }).then((result) => {
          if (result.isConfirmed) {
            const semillaIngresada = result.value;
            if (!isNaN(semillaIngresada) && semillaIngresada != null && semillaIngresada != '') {
                
                reiniciarPartida(semillaIngresada);

            } else {
              mostrarAlertaSemilla();
            }
          } else {
            mostrarAlertaFinDeJuego(puntaje);
          }
        });
      }


      function terminarJuego() {
        Swal.fire({
            title: '¿Estas seguro de terminar el juego?',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            allowOutsideClick: () => false
          }).then((result) => {
            if (result.isConfirmed) {
              let puntaje = mano.length + barajado.length; 
              guardarRegistroDePartida(puntaje);
              localStorage.removeItem('datosDelJuego');
              window.location.href = '/index.html';
            }  
          });
      }

      function reiniciarPartida(semillaNueva) {
        // Limpia el almacenamiento local
        localStorage.removeItem('datosDelJuego');

        // Restablece todas las variables del juego a sus valores iniciales
        superior1 = [];
        superior2 = [];
        inferior1 = [];
        inferior2 = [];
        mazo = [];
        mano = [];
        semilla = semillaNueva;
        inicioPartida = true;
        actualizarManoHTML();
        mostrarColumnasEhijos();
        actualizarHTML(superior1, 'superior1');
        actualizarHTML(superior2, 'superior2');
        actualizarHTML(inferior1, 'inferior1');
        actualizarHTML(inferior2, 'inferior2');
        mazo = crearMazo();
        // Baraja nuevamente las cartas con la misma semilla
        barajado = barajarCartas(mazo, semilla);
        
        // Vuelve a servir las cartas en la mano
        servirCartasEnManoArreglo();
    
        // Actualiza la interfaz de usuario
        ponerCartasEnManoHTML();
        guardarDatosDelJuego();
        imprimirSemilla();
        actualizarManoHTML();

    }
    

    function guardarRegistroDePartida(puntaje){
        // Al finalizar una partida
        
        const semillaAGuardar = semilla; // Semilla de la partida
        const puntajeAGuardar = puntaje; // Puntaje de la partida

        // obtener los registros de partidas del usuario desde localStorage (si existen)
        const registros = JSON.parse(localStorage.getItem('registrosPartidas')) || [];

        // Busca un registro correspondiente a la semilla actual
        const registroExistente = registros.find(registro => registro.usuario === usuario && registro.semilla === semillaAGuardar);
    
        if (registroExistente) {
             registroExistente.vecesJugadas++;
        
        if (puntaje < registroExistente.puntaje) {
             registroExistente.puntaje = puntajeAGuardar; // Actualiza el puntaje si es un récord
            guardarDatosPartida(registroExistente.usuario, registroExistente.semilla, registroExistente.vecesJugadas,  puntajeAGuardar);
        }
        guardarDatosPartida(registroExistente.usuario, registroExistente.semilla, registroExistente.vecesJugadas++, registroExistente.puntaje);
        } else {
        // Si es la primera vez que el usuario juega esta semilla, crea un nuevo registro
         registros.push({ usuario: usuario, semilla: semillaAGuardar, vecesJugadas: 1, puntaje: puntaje });
        guardarDatosPartida(usuario, semillaAGuardar, 1, puntaje);

        }

        //  Guarda los registros actualizados en localStorage
         localStorage.setItem('registrosPartidas', JSON.stringify(registros));
    }

    // Función para enviar datos de la partida al servidor
    function guardarDatosPartida(nombre, semilla, vecesJugadas, puntaje) {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('semilla', semilla);
        formData.append('vecesJugadas', vecesJugadas);
        formData.append('puntaje', puntaje);

        fetch('guardarDatosPartida.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Muestra la respuesta del servidor en la consola
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    btnTurno.onclick = () =>{
        ponerCartasEnManoHTML();
    }

    document.addEventListener("DOMContentLoaded", function () {
        EmpezarJuego();
    });

    function EmpezarJuego(){
        // Verifica si hay datos previamente guardados
        cargarDatosDelJuego();
    }

    // Función para guardar los datos del juego en el almacenamiento local
    function guardarDatosDelJuego() {
        const datosDelJuego = {
        superior1: superior1,
        superior2: superior2,
        inferior1: inferior1,
        inferior2: inferior2,
        mano: mano,
        barajado: barajado,
        inicioPartida: inicioPartida,
        semilla: semilla,
        usuario: usuario
        };
        localStorage.setItem('datosDelJuego', JSON.stringify(datosDelJuego));
    }

    // Función para cargar los datos del juego desde el almacenamiento local
    function cargarDatosDelJuego() {
        const datosDelJuegoJSON = localStorage.getItem('datosDelJuego');
        if (datosDelJuegoJSON) {
        const datosDelJuego = JSON.parse(datosDelJuegoJSON);
    
        // Cargar los datos en las variables del juego
        superior1 = datosDelJuego.superior1;
        superior2 = datosDelJuego.superior2;
        inferior1 = datosDelJuego.inferior1;
        inferior2 = datosDelJuego.inferior2;
        mano = datosDelJuego.mano;
        barajado = datosDelJuego.barajado;
        inicioPartida = datosDelJuego.inicioPartida;
        semilla = datosDelJuego.semilla;
        usuario = datosDelJuego.usuario;
        // Llamar a la función para actualizar la interfaz de usuario con los datos cargados
        actualizarHTML(superior1, 'superior1');
        actualizarHTML(superior2, 'superior2');
        actualizarHTML(inferior1, 'inferior1');
        actualizarHTML(inferior2, 'inferior2');
        imprimirSemilla();
        actualizarManoHTML();
        } else {

             // Si no hay datos guardados, verifica la URL
            const urlParams = new URLSearchParams(window.location.search);
            const nombre = urlParams.get("nombre");
            const semillaParam = urlParams.get("semilla");
            if (!nombre || !semillaParam) {
                // Si falta el nombre o la semilla en la URL, muestra una alerta
                Swal.fire({
                    title: 'Estás tratando de ingresar sin haber puesto todos los datos',
                    text: 'Ingrese nombre y semilla por favor',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/index.html';
                    }
                });
                return;
            }

            if (semillaParam === "aleatoria") {
                // Generar una semilla aleatoria
                semilla = generarSemillaAleatoria();
            } else if (/^\d{1,4}$/.test(semillaParam)) {
                // Verificar si semillaParam es un número de hasta 4 caracteres
                semilla = parseInt(semillaParam, 10);
            } else {
                Swal.fire({
                    title: 'Estás tratando de ingresar sin ingresar semilla válida',
                    text: 'Ingrese semilla por favor',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/index.html';
                    }
                });
                 return;
            }
    
            mazo = crearMazo();
            usuario = nombre;
            barajado = barajarCartas(mazo, semilla);
            console.log(barajado);
            imprimirSemilla();
            servirCartasEnManoArreglo();
            ponerCartasEnManoHTML();
            guardarDatosDelJuego();
        }
    }

    function imprimirSemilla(){
        const contenedorSemilla = document.querySelector('.semilla');
        contenedorSemilla.innerHTML = '';
        const parrafoSemilla = document.createElement('P');
        parrafoSemilla.textContent = `Semilla : ${semilla}`;
        contenedorSemilla.appendChild(parrafoSemilla);
    }