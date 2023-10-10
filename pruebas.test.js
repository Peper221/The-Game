 const { validarMovimiento, crearMazo, generarSemillaAleatoria } = require('./funcionesATest/funciones');
 
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
