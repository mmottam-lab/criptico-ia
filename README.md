# El Archivo 2036

Criptico de cinco capas que se resuelve conversando con una IA. Actividad de demostracion para la Licenciatura en Inteligencia Artificial de CENTRO. Dura alrededor de una hora.

## Como funciona

- Cada equipo registra su nombre y arranca el cronometro (vive en el navegador, un dispositivo por equipo).
- Cinco niveles encadenados: Cesar, sustitucion, Vigenere, acertijo (acrostico) y un guardian conversacional.
- Cada nivel tiene un chat conectado a Gemini. En los niveles 1 a 4 la IA actua como tutora: pregunta, ofrece una pista cada vez y ayuda a comprobar intentos sin entregar la solucion. En el nivel 5 la IA es el guardian: tiene la palabra final y solo la entrega tras demostrar el recorrido (o creatividad) y explicar una estrategia y su comprobacion.
- La palabra de cada nivel se valida en el servidor (`/api/validate`); las respuestas nunca llegan al navegador.
- Una pista por nivel, con penalizacion de 2 minutos.

## Correrlo

```bash
npm ci
cp .env.example .env.local   # pega tu GEMINI_API_KEY
npm run dev
```

Requiere Node.js 22 o superior. La clave se guarda solo en `.env.local` o en las variables del servidor, nunca en el navegador.

## Verificar cambios

```bash
npm test
npm run typecheck
npm run build
```

Las pruebas simulan Gemini; no consumen cuota ni sustituyen una prueba con una clave real.

## Deploy en Vercel

1. Importa este repo en Vercel (framework: Next.js, sin configuracion extra).
2. En Settings > Environment Variables agrega `GEMINI_API_KEY` (y opcionalmente `GEMINI_MODEL`, por defecto `gemini-3.8-flash`).
3. Deploy.

## Donde cambiar cosas

- `lib/niveles.ts`: textos, intros, pistas (contenido publico).
- `lib/secretos.ts`: respuestas de cada nivel y el system prompt del guardian (solo servidor).
- `app/api/chat/route.ts`: llamada a Gemini.
- `GUIA_FACILITADOR.md`: respuestas, prompts de referencia y plan de la hora. No subir a un lugar publico.

## Alcance de la actividad

Las respuestas no se incluyen en el JavaScript del navegador, pero este repositorio y la guia del facilitador contienen las soluciones. Si el repositorio es publico, cualquiera puede consultarlas. El progreso y el tiempo se guardan en el dispositivo y no son un registro competitivo protegido contra modificaciones.

La API de chat no tiene autenticacion ni limite de peticiones por equipo. Antes de una convocatoria publica, conviene agregar control de acceso y limites persistentes para proteger la cuota de Gemini.

Si falla el chat, el mensaje vuelve al campo de escritura para reintentarlo. Los errores distinguen falta de configuracion, limite de cuota, modelo inaccesible y tiempo de espera agotado.

## Mision visual y aprendizajes

Cada sector combina un reto de criptografia con un descubrimiento sobre IA y una pregunta con retroalimentacion. No hay penalizacion por reintentar la pregunta; el cronometro sigue corriendo. Se avanza al siguiente sector despues de responderla correctamente. El descubrimiento pendiente se conserva al recargar.

`lib/aprendizajes.ts` define conceptos, conexiones y preguntas. Al terminar, la bitacora permite repasar las cinco ideas. Las partidas anteriores siguen siendo compatibles.

### Sector 1: Entrena al robot
El primer reto es ahora un clasificador local de una decisión (color o forma), entrenado con etiquetas del equipo. Los primeros cuatro ejemplos correlacionan ambos atributos; el desempate favorece color y produce errores en piezas nuevas. Se amplía el conjunto con otras combinaciones, se reentrena y se evalúa. Al acertar las cuatro pruebas con el conjunto ampliado, entrega SEMILLA y la pregunta de aprendizaje. No es el mismo modelo que el chat. Las etiquetas se guardan localmente y se borran al reiniciar la misión.
