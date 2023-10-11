const superior1 = [{numero: 99},{numero: 90}, {numero: 89}];
const superior2 = [];
const inferior1 = [];
const inferior2 = [];
let mazo = [];

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

function generarNumeroPseudoAleatorio(semilla) {
    let x = Math.sin(semilla++) * 10000;
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
 
crearMazo();
const semilla = generarSemillaAleatoria();
const barajado = barajarCartas(mazo, semilla);


module.exports = {
    validarMovimiento: validarMovimiento,
    crearMazo: crearMazo,
    barajarCartas: barajarCartas,
    generarSemillaAleatoria: generarSemillaAleatoria
};