"use client";
import { useEffect, useRef, useState } from 'react';
import { APRENDIZAJES } from '@/lib/aprendizajes';
import ArchivoScene from './ArchivoScene';

export default function Descubrimiento({ nivel, continuar }: { nivel: number; continuar: () => void }) {
  const a = APRENDIZAJES[nivel-1];
  const [eleccion, setEleccion] = useState<number | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const correcto = eleccion === a.correcta;
  useEffect(() => { titulo.current?.focus(); window.scrollTo({ top: 0 }); }, []);
  return <section className="discovery" aria-labelledby="discovery-title">
    <div className="discovery-art"><ArchivoScene completados={nivel} compacto /><p className="eyebrow">Fragmento {nivel} / 5 recuperado</p><p>El código abrió una puerta.<br />Ahora, conecta lo que descubriste.</p></div>
    <div className="discovery-content">
      <p className="eyebrow">Descubrimiento de IA</p>
      <h1 id="discovery-title" tabIndex={-1} ref={titulo}>{a.titulo}</h1>
      <p className="concept-text">{a.concepto}</p>
      <div className="connection-note"><span>LO QUE ACABAS DE HACER</span><p>{a.conexion}</p></div>
      <fieldset className="knowledge-check"><legend>{a.pregunta}</legend>
        {a.opciones.map((opcion,i) => <button type="button" key={opcion} className={`answer-option ${eleccion === i ? correcto ? 'correct' : 'retry' : ''}`} aria-pressed={eleccion === i} disabled={correcto} onClick={() => setEleccion(i)}><span>{String.fromCharCode(65+i)}</span>{opcion}</button>)}
      </fieldset>
      <div className="quiz-feedback" aria-live="polite">{eleccion !== null && <p>{a.explicaciones[eleccion]}{!correcto && ' Prueba otra opción; no hay penalización.'}</p>}</div>
      <button className="mission-button" disabled={!correcto} onClick={continuar}>{nivel === 5 ? 'Abrir el archivo completo' : 'Explorar el siguiente sector'} <span aria-hidden="true">→</span></button>
    </div>
  </section>;
}
