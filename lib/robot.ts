export type Pieza = { id: number; forma: "triangulo" | "circulo"; color: "verde" | "rosa" };
export const EJEMPLOS: Pieza[] = [
  {id:0,forma:"triangulo",color:"verde"}, {id:1,forma:"circulo",color:"rosa"},
  {id:2,forma:"triangulo",color:"verde"}, {id:3,forma:"circulo",color:"rosa"},
  {id:4,forma:"triangulo",color:"rosa"}, {id:5,forma:"circulo",color:"verde"},
  {id:6,forma:"triangulo",color:"rosa"}, {id:7,forma:"circulo",color:"verde"},
];
export const PRUEBAS: Pieza[] = [
  {id:10,forma:"triangulo",color:"verde"}, {id:11,forma:"circulo",color:"verde"},
  {id:12,forma:"triangulo",color:"rosa"}, {id:13,forma:"circulo",color:"rosa"},
];
export type Modelo = { atributo: "color" | "forma"; etiquetas: Record<string, boolean> };
// Árbol de decisión de un nivel: elige la característica con menos errores.
// En empate elige color para hacer visible la ambigüedad de los primeros ejemplos.
export function entrenar(etiquetas: Record<number, boolean>): Modelo {
  const datos = EJEMPLOS.filter(p => typeof etiquetas[p.id] === "boolean");
  const candidatos = (["color", "forma"] as const).map(atributo => {
    const valores = [...new Set(datos.map(p => p[atributo]))];
    const reglas: Record<string, boolean> = {};
    for (const v of valores) {
      const grupo = datos.filter(p => p[atributo] === v);
      reglas[v] = grupo.filter(p => etiquetas[p.id]).length >= grupo.length / 2;
    }
    return {modelo:{atributo,etiquetas:reglas}, errores:datos.filter(p => reglas[p[atributo]] !== etiquetas[p.id]).length};
  });
  return candidatos[1].errores < candidatos[0].errores ? candidatos[1].modelo : candidatos[0].modelo;
}
export function predecir(modelo: Modelo, pieza: Pieza) { return modelo.etiquetas[pieza[modelo.atributo]] ?? false; }
export function aciertos(modelo: Modelo) { return PRUEBAS.filter(p => predecir(modelo,p) === (p.forma === "triangulo")).length; }
