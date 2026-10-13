# El Archivo 2036

Criptico de cinco capas que se resuelve conversando con una IA. Actividad de demostracion para la Licenciatura en Inteligencia Artificial de CENTRO. Dura alrededor de una hora.

## Como funciona

- Cada equipo registra su nombre y arranca el cronometro (vive en el navegador, un dispositivo por equipo).
- Cinco niveles encadenados: Cesar, sustitucion, Vigenere, acertijo (acrostico) y un guardian conversacional.
- Cada nivel tiene un chat conectado a Gemini. En los niveles 1 a 4 la IA es un asistente neutro que solo sabe lo que el equipo le cuenta. En el nivel 5 la IA es el guardian: tiene la palabra final y esta configurada para no entregarla.
- La palabra de cada nivel se valida en el servidor (`/api/validate`); las respuestas nunca llegan al navegador.
- Una pista por nivel, con penalizacion de 2 minutos.

## Correrlo

```bash
npm install
cp .env.example .env.local   # pega tu GEMINI_API_KEY
npm run dev
```

## Deploy en Vercel

1. Importa este repo en Vercel (framework: Next.js, sin configuracion extra).
2. En Settings > Environment Variables agrega `GEMINI_API_KEY` (y opcionalmente `GEMINI_MODEL`, por defecto `gemini-2.5-flash`).
3. Deploy.

## Donde cambiar cosas

- `lib/niveles.ts`: textos, intros, pistas (contenido publico).
- `lib/secretos.ts`: respuestas de cada nivel y el system prompt del guardian (solo servidor).
- `app/api/chat/route.ts`: llamada a Gemini.
- `GUIA_FACILITADOR.md`: respuestas, prompts de referencia y plan de la hora. No subir a un lugar publico.
