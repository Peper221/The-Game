 const { validarMovimiento, crearMazo, generarSemillaAleatoria, barajarCartas } = require('./funcionesATest/funciones');
 
describe('Validación de Movimiento', () => {
    it('debe validar un movimiento válido a una pila superior', () => {
      const carta = { numero: 5 };
      const espacioId = 'superior1';
      const resultado = validarMovimiento(carta, espacioId);
  
      expect(resultado).toBe(true);
    });
  
    it('debe validar un movimiento inválido a una pila superior', () => {
      const carta = { numero: 95 };
      const espacioId = 'superior1';
  
      const resultado = validarMovimiento(carta, espacioId);
  
      expect(resultado).toBe(false);
    });
  
  });

describe('crearMazo', () => {
  it('debe crear un mazo con 98 cartas numeradas desde 2 hasta 99', () => {
      let mazo = crearMazo();
 
      expect(Array.isArray(mazo)).toBe(true); // Verifica que se haya creado un array
      expect(mazo).toHaveLength(98); // Verifica que haya 98 cartas en el mazo

      // Verifica que las cartas tengan números y nombres de imagen válidos
      for (let i = 2; i <= 99; i++) {
          expect(mazo).toContainEqual({ numero: i, img: `${i}` });
      }
  });
});

describe('generarSemillaAleatoria', () => {
  it('debe generar una semilla dentro del rango especificado', () => {
      const semilla = generarSemillaAleatoria();
      expect(semilla).toBeGreaterThanOrEqual(0); // Verifica que la semilla sea mayor o igual a 0
      expect(semilla).toBeLessThan(10000); // Verifica que la semilla sea menor que 10000
  });
});

describe('barajar con la semilla', () => {
  it('debe barajar un array con una semilla específica', () => {
      const semilla = 12345; // definir semilla específica
      const arrayOriginal = [{numero:1, img: '1'}, {numero:2, img: '2'}, {numero:3, img: '3'}, {numero:4, img: '4'}, {numero:5, img: '5'}];
      const arrayBarajado = barajarCartas(arrayOriginal, semilla);
      console.log(arrayBarajado);
      // Definir el orden esperado después del barajado usando la semilla 12345
      const ordenEsperado = [{numero:5, img: '5'} ,{numero:1, img: '1'},{numero:4, img: '4'}, {numero:3, img: '3'},   {numero:2, img: '2'}];

      expect(arrayBarajado).toEqual(ordenEsperado); // Verificar que el array barajado sea igual al orden esperado
  });
});