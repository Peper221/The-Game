 
 let cartaSeleccionada = null;

 function seleccionarCarta(carta) {
    if (cartaSeleccionada === carta) {
        // Si se hace clic en la misma carta dos veces, deseleccionarla
        carta.style.border = "5px solid seashell"; // Restaura el borde
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
        // Si hay una carta seleccionada y no es el mismo espacio carta
        espacioCarta.innerHTML = cartaSeleccionada.innerHTML; // Mueve la imagen
        cartaSeleccionada.innerHTML = ""; // Elimina la imagen de la carta seleccionada
        cartaSeleccionada.style.border = "5px solid seashell"; // Restaura el borde
        cartaSeleccionada = null; // Reinicia la variable
    } else {
        // Si no hay carta seleccionada o se intenta mover a la misma ubicación, no hacer nada
    }
}


let mazo = [];

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
 
crearMazo();
 
console.log(mazo);