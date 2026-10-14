import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from '../components/Markdown';

test('renderiza negritas, listas, tablas y codigo como elementos semanticos', () => {
  const html = renderToStaticMarkup(<Markdown>{'**Respuesta**\n\n- Paso uno\n- Paso dos\n\n```python\nprint("hola")\n```\n\n| Letra | Valor |\n| --- | --- |\n| A | 1 |'}</Markdown>);
  for (const tag of ['<strong>Respuesta</strong>', '<ul>', '<li>', '<pre>', '<table>', '<th>']) assert.ok(html.includes(tag), tag);
  assert.ok(!html.includes('**Respuesta**'));
});

test('no activa HTML, enlaces javascript ni imagenes externas del modelo', () => {
  const html = renderToStaticMarkup(<Markdown>{'<script>alert(1)</script>\n\n[enlace](javascript:alert%281%29)\n\n![imagen](https://example.com/tracker.png)'}</Markdown>);
  assert.ok(!html.includes('<script'));
  assert.ok(!html.includes('javascript:'));
  assert.ok(!html.includes('<img'));
});
