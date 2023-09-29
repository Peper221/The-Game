
    let cartaSeleccionada = null;
    const btnTurno = document.querySelector('#btnTurno');
    const btnDeshacer = document.querySelector('#btnDeshacer');
    let movimientosDuranteTurno = []; // Arreglo para almacenar los movimientos
    let inicioPartida = true;
    let mazo = [];
    let barajado = [];
    let mano = [];

    let superior1 = [];
    let superior2 = [];
    let inferior1 = [];
    let inferior2 = [];

    function seleccionarCarta(carta) {
        if (cartaSeleccionada === carta) {
            // Si se hace clic en la misma carta dos veces, deseleccionarla
            carta.style.border = "none"; // Restaura el borde
            cartaSeleccionada = null; // Reinicia la variable de selección
        } else if (cartaSeleccionada === null) {
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
                        console.log('movimientos: ' + movimientosDuranteTurno);
                        if(cartaSeleccionada.parentNode && cartaSeleccionada.parentNode.id.startsWith('mano')){
                            const padreCartaSeleccionada = cartaSeleccionada.parentNode;
                            const columna = padreCartaSeleccionada.parentNode;
                            
                            padreCartaSeleccionada.removeChild(cartaSeleccionada);
                            padreCartaSeleccionada.style.display = 'none';
                        
                           // Cambiar el atributo CSS grid-template-columns de 2fr a 1fr
                            columna.style.gridTemplateColumns = '1fr';
                            columna.style.marginRight = '0';
                              
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

    btnDeshacer.onclick = () => {

        if(cartaSeleccionada != null){
            cartaSeleccionada = null;
        }
 
        // Itera a través de los movimientos registrados durante el turno
        for (const carta of movimientosDuranteTurno) {
           
            // Habilitar los espacios en blanco en la mano (mostrarlos)
            for (let i = 0; i < 8; i++) {
                const espacioMano = document.getElementById(`mano-${i}`);

                if (espacioMano.style.display === 'none') {
                    espacioMano.style.display = 'block';
                    espacioMano.parentNode.style.gridTemplateColumns = 'repeat(2,1fr)';
                }
              
            }

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
     // Actualizar el HTML de la mano
        // Ordenar la mano de menor a mayor
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
        mazo = [];
        for(let i = 2; i <= 99; i++){
            const carta = {
                numero : i,
                img: `${i}`
            }
            mazo.push(carta); 
        }
    }

    function barajarMazo() {
        barajado = mazo
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
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
             // Ordenar la mano de menor a mayor
             mano.sort((a, b) => a.numero - b.numero);
            for (let i = 0; i < mano.length; i++) {

                    const espacioMano = document.querySelector(`#mano-${i}`);
                    const carta = mano[i];
                    const cartaHTML = crearCartaHTML(carta);
                    espacioMano.appendChild(cartaHTML)
                
                }
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
           
        
              // Habilitar los espacios en blanco en la mano (mostrarlos)
            for (let i = 0; i < 8; i++) {
                const espacioMano = document.getElementById(`mano-${i}`);

                if (espacioMano.style.display === 'none') {
                    espacioMano.style.display = 'block';
                    espacioMano.parentNode.style.gridTemplateColumns = 'repeat(2,1fr)';
                }
              
            }

            if (cartasFaltantes > 0) {
                // Obtener los espacios en blanco en la mano
                //  const espaciosBlancos = Array.from(document.querySelectorAll('.espacio-mano'))
                //      .filter(espacio => espacio.childElementCount === 0);

                 // Llenar los espacios en blanco con nuevas cartas si hay suficientes en el mazo
                for (let i = 0; i < cartasFaltantes && barajado.length > 0; i++) {
                    // Tomar una carta del mazo barajado
                    const cartaTomada = barajado.shift();
                    // Agregar la carta a la mano
                    mano.push(cartaTomada);
                }

                // Ordenar la mano de menor a mayor
                mano.sort((a, b) => a.numero - b.numero);
                
                    // Actualizar el HTML de la mano
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
                    movimientosDuranteTurno = [];
            }
                
            
            verificarMovimientosCompatiblesEnPilas();
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
                AlertaFinDeJuego(puntaje);
                
            }
         }
    }

    function AlertaFinDeJuego(puntaje){
        Swal.fire({
            title: '<strong>Fin del juego</strong>',
            html:
              `Tu puntaje es de: <b> ${puntaje}</b> `,
            showDenyButton: true,
            showCloseButton: true,
            focusConfirm: false,
            denyButtonText: `Cancelar`,
            confirmButtonText:
              '<i class="fa fa-thumbs-up">Nuevo Juego</i>',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then((result) => {
            if (result.isConfirmed) {
                 location.reload(); // se recarga la página
            }
          });
    }

    btnTurno.onclick = () =>{
        ponerCartasEnManoHTML();
    }

    document.addEventListener("DOMContentLoaded", function () {
        EmpezarJuego();
    });

    function EmpezarJuego(){
        crearMazo();
        barajarMazo();
        servirCartasEnManoArreglo();
        ponerCartasEnManoHTML();
    }
