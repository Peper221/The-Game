 
 let cartaSeleccionada = null;

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
            
            eliminarCartaDeArreglo(cartaSeleccionada.parentNode, cartaSeleccionada);
            cartaSeleccionada.innerHTML = ""; // Elimina la imagen de la carta seleccionada
            cartaSeleccionada.style.border = "none"; // Restaura el borde
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

           
        }
    }
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
    if(cartaSeleccionada == null && espacio.lastElementChild != 'i100'){
        
    }else { 
        moverCarta(carta); 

    }
    
}   

function moverDesdeInferior(espacio) {
    // Lógica para mover cartas desde el superior a otros lugares
    carta  = espacio.lastElementChild;
    if(cartaSeleccionada == null && espacio.lastElementChild != 'i1'){
        
    }else { 
        moverCarta(carta); 

    }
}




let mazo = [];
let barajado = [];
let mano = [];


let superior1 = [];
let superior2 = [];
let inferior1 = [];
let inferior2 = [];

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
    for (let i = 0; i < mano.length; i++) {
        const espacioMano = document.querySelector(`#mano-${i}`);
            const carta = mano[i];
            const cartaHTML = crearCartaHTML(carta);
            espacioMano.appendChild(cartaHTML)
    
    }
}

crearMazo();
barajarMazo();
servirCartasEnManoArreglo();
ponerCartasEnManoHTML();
 