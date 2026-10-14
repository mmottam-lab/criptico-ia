import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST as chat } from '../app/api/chat/route';
import { POST as validar } from '../app/api/validate/route';
import { leerProgreso, leerChat, tiempoTotalMs } from '../lib/progreso';
import { NIVELES } from '../lib/niveles';

const originalFetch = globalThis.fetch;
const originalKey = process.env.GEMINI_API_KEY;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalKey;
});
const request = (body: unknown) => new Request('http://localhost/api', { method: 'POST', body: JSON.stringify(body) });
const conversacion = { nivel: 1, mensajes: [{ role: 'user', text: 'Hola' }] };

test('las APIs rechazan JSON nulo y estructuras incorrectas sin fallar', async () => {
  for (const body of [null, [], {}, { nivel: 1, mensajes: {} }]) {
    assert.equal((await chat(request(body))).status, 400);
    assert.equal((await validar(request(body))).status, 400);
  }
});

test('la validacion normaliza acentos y rechaza respuestas incorrectas', async () => {
  assert.deepEqual(await (await validar(request({ nivel: 3, codigo: ' oráculo ' }))).json(), { ok: true });
  assert.deepEqual(await (await validar(request({ nivel: 3, codigo: 'otra' }))).json(), { ok: false });
  assert.equal((await validar(request({ nivel: 1.5, codigo: 'x' }))).status, 400);
});

test('el chat detecta configuracion ausente', async () => {
  delete process.env.GEMINI_API_KEY;
  assert.equal((await chat(request(conversacion))).status, 503);
});

test('el chat maneja red, espera agotada, cuota y respuestas vacias', async () => {
  process.env.GEMINI_API_KEY = 'test-only';
  for (const [mock, status] of [
    [async () => { throw new TypeError('offline'); }, 502],
    [async () => { throw new DOMException('timeout', 'TimeoutError'); }, 504],
    [async () => new Response('{}', { status: 429 }), 429],
    [async () => Response.json({ candidates: [] }), 502],
    [async () => new Response('not json'), 502],
  ] as const) {
    globalThis.fetch = mock as typeof fetch;
    const response = await chat(request(conversacion));
    assert.equal(response.status, status);
    assert.equal(typeof (await response.json()).error, 'string');
  }
});

test('el chat reenvia el contexto y devuelve una respuesta correcta', async () => {
  process.env.GEMINI_API_KEY = 'test-only';
  globalThis.fetch = (async (_url, init) => {
    const body = JSON.parse(init!.body as string);
    assert.equal(body.contents[0].parts[0].text, 'Hola');
    assert.ok(body.systemInstruction);
    assert.ok(init!.signal);
    return Response.json({ candidates: [{ content: { parts: [{ text: 'Hola equipo' }] } }] });
  }) as typeof fetch;
  assert.deepEqual(await (await chat(request(conversacion))).json(), { text: 'Hola equipo' });
});

test('el almacenamiento corrupto no rompe la partida ni el chat', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null };
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {} });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
  try {
    for (const value of ['null', '{}', '[]', '{broken', '{"pistas":null}']) {
      values.set('archivo2036', value);
      values.set('archivo2036:chat:1', value);
      assert.equal(leerProgreso(), null);
      assert.deepEqual(leerChat(1), []);
    }
    const p = { equipo: 'Prueba', inicio: 1000, desbloqueado: 6, fin: 61000, pistas: [1, 1, 3] };
    values.set('archivo2036', JSON.stringify(p));
    assert.deepEqual(leerProgreso()!.pistas, [1, 3]);
    assert.equal(tiempoTotalMs(leerProgreso()!), 300000);
  } finally {
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'localStorage');
  }
});

test('los cifrados revelan las palabras que acepta el servidor', async () => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const substitution = 'WVAGOETXQKYPICRSJMDFNZHBUL';
  for (let level = 1; level <= 4; level++) {
    let index = 0;
    const text = NIVELES[level - 1].texto;
    const decoded = level === 4 ? text.split('\n').map(line => line[0]).join('') : text.replace(/[A-Z]/g, c => {
      if (level === 1) return alphabet[(alphabet.indexOf(c) + 19) % 26];
      if (level === 2) return alphabet[substitution.indexOf(c)];
      return alphabet[(alphabet.indexOf(c) - alphabet.indexOf('NEURONA'[index++ % 7]) + 26) % 26];
    });
    const code = level === 4 ? decoded : decoded.match(level === 3 ? /ESCRIBAN (\w+)/ : /PALABRA (\w+)/)![1];
    assert.deepEqual(await (await validar(request({ nivel: level, codigo: code }))).json(), { ok: true });
  }
});
