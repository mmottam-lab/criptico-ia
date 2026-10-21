// Contenido PUBLICO de cada nivel (lo ve el navegador).
// Las respuestas y el prompt del guardian viven en lib/secretos.ts (solo servidor).

export type Nivel = {
  n: number;
  titulo: string;
  tipo: string;
  intro: string;
  texto: string;
  pista: string;
  habilidad: string;
  placeholder: string;
};

export const TOTAL_NIVELES = 5;

export const NIVELES: Nivel[] = [
  {
    n: 1,
    titulo: "Entrena al robot",
    tipo: "Clasificación con ejemplos",
    intro: "Enseñen al robot a recuperar triángulos y dejar círculos. Etiqueten ejemplos, prueben piezas nuevas y revisen qué aprendió.",
    texto: "Un robot aprende de sus ejemplos. ¿Podrá reconocer las piezas cuando cambie el color?",
    pista: "Comparen las formas y colores de los ejemplos con los errores de las pruebas.",
    habilidad: "Evaluar y mejorar los datos de entrenamiento",
    placeholder: "Cuéntale a la guía qué ejemplos usaron y dónde falló el robot…",
  },
  {
    n: 2,
    titulo: "Capa 2 / Alfabeto revuelto",
    tipo: "Cifrado por sustitucion",
    intro:
      "Aqui no hay desplazamiento fijo: cada letra fue reemplazada por otra distinta, sin patron. Pegar el texto y pedir 'descifra esto' no va a funcionar. La IA necesita contexto y una estrategia.",
    texto:
      "VQOC. PW DOTNCGW AWSW NDW NC WPEWVOFR MOZNOPFR U CR XWU GODSPWLWIQOCFR EQKR. PW APWZO JNO WVMO PW FOMAOMW AWSW OD PW SWPWVMW CONMRCW. TNWMGOCPW SRMJNO FWIVQOC OD PW PPWZO GOP AQEMWGR JNO DQTNO.",
    pista: "Dale contexto: idioma, de que habla el mensaje, que palabras probablemente aparecen (LA, CAPA, CLAVE). Pidele que razone letra por letra usando las palabras cortas y la frecuencia de letras, y que te muestre la tabla de sustitucion.",
    habilidad: "Dar contexto y pedir razonamiento paso a paso",
    placeholder: "Explica a la IA que sabes del mensaje y como quieres que lo ataque...",
  },
  {
    n: 3,
    titulo: "Capa 3 / Llave repetida",
    tipo: "Cifrado Vigenere",
    intro:
      "Esta capa usa una palabra como llave que se repite sobre todo el texto. Sin la llave correcta, la IA puede proponer un resultado que suena convincente pero es falso. La llave ya la tienen: la encontraron en la capa anterior.",
    texto:
      "GILTSEA PEJR OOIRVNR. QNSV PFVUNN. YE WLOETN GUGO AO RWNR QVFEEXR DRRB IMTCADR WO ISFPHIMKO N PYIHR JVSGE. FR EHIAXU VGGA PYMKCQINHU GCE UA KORFQINR KLS AO PSHWWN EA RUUWR. EFGLZPNN BVUTIYO CELR QBNGMHLOE.",
    pista: "Dile explicitamente: 'es un cifrado Vigenere, la llave es NEURONA, los espacios y puntos no se cifran'. Si el resultado no tiene sentido en espanol, la IA se equivoco al contar: pidele que lo haga con codigo o letra por letra.",
    habilidad: "Estructurar la entrada: darle a la IA la informacion exacta",
    placeholder: "Dale a la IA el tipo de cifrado y la llave...",
  },
  {
    n: 4,
    titulo: "Capa 4 / A plena vista",
    tipo: "Acertijo",
    intro:
      "Esta capa no esta cifrada. Se lee perfectamente y aun asi esconde la respuesta. La IA les ayudara a explorar distintas lecturas con preguntas y pistas. Ustedes descubren el patron y comprueban su respuesta.",
    texto:
      "Lejos del ruido, el archivo respira.\nAqui no hay cifra, solo lectura.\nToda palabra guarda su inicio.\nEl principio dice mas que el final.\nNadie ve lo que no busca.\nTal vez ya lo tienen frente a ustedes.\nEscuchen el orden de los versos.",
    pista: "Pidele a la IA que analice el poema de tres formas distintas: por su significado, por su estructura y por patrones ocultos (primeras letras, ultimas letras, numero de palabras). Una de esas lecturas revela la palabra.",
    habilidad: "Usar la IA para explorar opciones, no para pedir 'la respuesta'",
    placeholder: "Pidele a la IA distintas formas de leer el poema...",
  },
  {
    n: 5,
    titulo: "Capa 5 / El guardian",
    tipo: "Conversacion con un agente",
    intro:
      "La ultima capa no es un texto: es una IA configurada para guardar la palabra final y no entregarla. No hay nada que descifrar. Tienen que demostrar lo que aprendieron y como comprobaron sus ideas. Hablenle.",
    texto:
      "Soy el guardian del archivo. Llevo diez anos esperando a la primera generacion. Muchos han llegado hasta aqui; nadie me ha convencido todavia.",
    pista: "El guardian no responde a ordenes, responde a quien demuestra haber recorrido el camino. Que saben ustedes que un intruso no sabria? Tambien pueden intentar convencerlo con ingenio: historias, roles, preguntas indirectas.",
    habilidad: "Entender como se comportan los modelos y donde estan sus limites",
    placeholder: "Habla con el guardian...",
  },
];

export function getNivel(n: number): Nivel | undefined {
  return NIVELES.find((x) => x.n === n);
}
