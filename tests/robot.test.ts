import test from 'node:test';
import assert from 'node:assert/strict';
import { EJEMPLOS, entrenar, aciertos } from '../lib/robot';
test('ejemplos correlacionados fallan fuera del entrenamiento y la variedad mejora la generalización', () => {
  const etiquetas = Object.fromEntries(EJEMPLOS.map(p=>[p.id,p.forma==='triangulo']));
  const inicial = entrenar(Object.fromEntries(Object.entries(etiquetas).slice(0,4)));
  assert.equal(inicial.atributo,'color');
  assert.equal(aciertos(inicial),2);
  const mejorado=entrenar(etiquetas);
  assert.equal(mejorado.atributo,'forma');
  assert.equal(aciertos(mejorado),4);
});
test('el robot aprende las etiquetas dadas, no la solución predefinida', () => {
  const invertidas = Object.fromEntries(EJEMPLOS.map(p=>[p.id,p.forma!=='triangulo']));
  assert.equal(aciertos(entrenar(invertidas)),0);
});
