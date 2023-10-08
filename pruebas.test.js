 const { validarMovimiento } = require('./funcionesATest/funciones');
 
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