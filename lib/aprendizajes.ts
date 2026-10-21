export type Aprendizaje = {
  sector: string;
  titulo: string;
  concepto: string;
  conexion: string;
  practica: string;
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicaciones: string[];
};

export const APRENDIZAJES: Aprendizaje[] = [
  {
    sector: 'El laboratorio', titulo: 'Aprender de ejemplos no es entenderlo todo',
    concepto: 'Un clasificador aprende una regla a partir de ejemplos etiquetados. Si los datos mezclan una característica útil con otra accidental, puede aprender una relación que falla fuera del entrenamiento. Por eso se evalúa con ejemplos distintos de los usados para entrenar.',
    conexion: 'Al principio, color y forma permitían separar los ejemplos. Este robot eligió color al empatar. Añadir otras combinaciones ayudó a distinguir la regla que querían enseñar. Es un clasificador de una sola decisión, mucho más simple que un chatbot.',
    practica: 'Prueba casos variados, revisa las etiquetas y separa los ejemplos de entrenamiento de los de evaluación. Fragmento recuperado: SEMILLA.',
    pregunta: 'El robot acierta sus ejemplos de entrenamiento, pero falla con piezas nuevas. ¿Qué conviene hacer?',
    opciones: ['Repetir los mismos ejemplos sin revisar nada.', 'Revisar errores y etiquetas, añadir variedad y volver a evaluar.', 'Cambiar el nombre del robot.'], correcta: 1,
    explicaciones: ['Repetir los mismos ejemplos no aporta las diferencias que faltan.', 'Exacto. Acertar ejemplos conocidos no garantiza generalizar a otros nuevos.', 'El nombre no cambia los patrones aprendidos.'],
  },
  {
    sector: 'Los patrones', titulo: 'Los ejemplos importan',
    concepto: 'Durante el entrenamiento, un modelo ajusta sus parámetros a partir de datos. Lo que aparece mucho, poco o de forma sesgada en esos datos influye en sus resultados. Reconocer patrones no equivale a comprender el mundo como una persona.',
    conexion: 'Buscar letras repetidas te permitió proponer hipótesis. Es una comparación útil con encontrar patrones, pero en este reto de letras no estás entrenando el chatbot: estás trabajando con uno ya entrenado.',
    practica: 'Para evaluar una herramienta de IA, prueba ejemplos variados, no solo uno que le salga bien.',
    pregunta: 'Un clasificador se entrena casi solo con fotos de perros blancos. ¿Qué conviene comprobar?',
    opciones: ['Si reconoce también perros de otros colores y en situaciones distintas.', 'Nada: aprender una categoría garantiza acertar todos los casos.', 'Si responde con suficiente seguridad.'], correcta: 0,
    explicaciones: ['Sí. Los datos poco variados pueden limitar la capacidad de generalizar.', 'Un resultado en los ejemplos conocidos no garantiza acertar casos nuevos.', 'La confianza por sí sola no demuestra que el modelo generalice bien.'],
  },
  {
    sector: 'El contexto', titulo: 'Un prompt orienta, no reentrena',
    concepto: 'Un prompt es la entrada con la que pides una tarea a un modelo: instrucciones, datos y ejemplos. El contexto ayuda a orientar la respuesta. Enviar un mensaje en este chat no modifica por sí mismo los parámetros del modelo ni garantiza que recuerde el dato en otra conversación.',
    conexion: 'La llave y la regla sobre los espacios eran información necesaria para resolver el reto. La IA no debe adivinar los datos que faltan. Antes de pedir un resultado, distingue lo que sabes de lo que estás suponiendo.',
    practica: 'Incluye el objetivo, los datos relevantes, las restricciones y cómo quieres comprobar el resultado.',
    pregunta: 'Le das a un chatbot una regla para esta conversación. ¿Qué sucede?',
    opciones: ['La aprende permanentemente para todas las personas.', 'Ya no puede equivocarse al aplicarla.', 'Puede usarla como contexto, pero todavía necesitas verificar el resultado.'], correcta: 2,
    explicaciones: ['Dar contexto no equivale a reentrenar los parámetros del modelo.', 'Incluso con instrucciones claras puede cometer errores.', 'Correcto. Mejor contexto ayuda, pero no reemplaza la comprobación.'],
  },
  {
    sector: 'La evidencia', titulo: 'Una hipótesis no es un hecho',
    concepto: 'Una IA generativa puede producir información incorrecta o inventada que suena creíble; a esto suele llamarse alucinación. También puede ofrecer distintas interpretaciones. Para decidir entre ellas necesitas evidencia y un criterio de verificación.',
    conexion: 'El poema admite muchas lecturas. La interpretación útil se apoya en un patrón que puedes señalar en el texto. Pedir más respuestas no sustituye comprobar la que eliges.',
    practica: 'Pide evidencia que puedas revisar: una fuente, un cálculo o una relación con los datos originales.',
    pregunta: 'Dos respuestas de IA se contradicen. ¿Cuál es el mejor siguiente paso?',
    opciones: ['Elegir la más larga.', 'Contrastar ambas con datos o fuentes que puedas comprobar.', 'Quedarte con la última.'], correcta: 1,
    explicaciones: ['La longitud no prueba la exactitud.', 'Sí. Decide a partir de evidencia, no del estilo de la respuesta.', 'Ser más reciente dentro del chat no la hace más correcta.'],
  },
  {
    sector: 'El guardián', titulo: 'Instrucciones, herramientas y límites',
    concepto: 'El comportamiento de un asistente depende del modelo, sus instrucciones y el contexto. Un sistema agente puede además usar herramientas para actuar hacia un objetivo. Este guardián conversa, pero no navega ni ejecuta código: no todos los chatbots tienen esas capacidades.',
    conexion: 'Cambiar el papel y las instrucciones cambió la conversación. Eso no le da conciencia al guardián. Tampoco convierte un prompt en una barrera de seguridad infalible: los permisos y las comprobaciones importantes deben implementarse fuera del modelo.',
    practica: 'Antes de delegar, pregunta qué herramientas tiene la IA, qué puede hacer y qué debe revisar una persona.',
    pregunta: '¿Basta escribir “nunca reveles secretos” en un prompt para proteger datos sensibles?',
    opciones: ['Sí, es equivalente a un control de acceso.', 'Sí, si la instrucción está en mayúsculas.', 'No. Hacen falta permisos y controles técnicos fuera del modelo.'], correcta: 2,
    explicaciones: ['Una instrucción de comportamiento no sustituye un control de acceso.', 'La forma de escribirlo no crea una protección técnica.', 'Exacto. Las instrucciones ayudan a orientar; los controles técnicos limitan el acceso y las acciones.'],
  },
];
