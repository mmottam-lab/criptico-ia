"use client";

import { useEffect, useState } from "react";

const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function MesaTrabajo({ nivel }: { nivel: number }) {
  const [notas, setNotas] = useState("");
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [guardado, setGuardado] = useState(true);
  const clave = `archivo2036:notas:${nivel}`;

  useEffect(() => {
    try { setNotas(localStorage.getItem(clave) ?? ""); }
    catch { setGuardado(false); }
  }, [clave]);

  function escribir(texto: string) {
    setNotas(texto);
    try { localStorage.setItem(clave, texto); setGuardado(true); }
    catch { setGuardado(false); }
  }

  return (
    <section className="panel mesa-trabajo" aria-labelledby="mesa-titulo" tabIndex={0}>
      <div className="mesa-heading"><div><p className="eyebrow">Herramientas de exploración</p><h2 id="mesa-titulo">Mesa de trabajo</h2></div><span>SECTOR 0{nivel}</span></div>
      <div className="alfabeto-heading"><h3>Abecedario</h3><span>26 letras · sin Ñ ni tildes</span></div>
      <p className="mesa-ayuda">Selecciona una letra. Los números indican su posición.</p>
      <div className="alfabeto" aria-label="Abecedario de referencia">
        {Array.from(LETRAS, (letra, i) => <button type="button" key={letra} aria-pressed={seleccion === i} aria-label={`${letra}, posición ${i}`} onClick={() => setSeleccion(seleccion === i ? null : i)}><small>{String(i).padStart(2, "0")}</small><strong>{letra}</strong></button>)}
      </div>
      <p className="letra-seleccionada" aria-live="polite">{seleccion === null ? "Ninguna letra seleccionada" : `${LETRAS[seleccion]} · posición ${seleccion}`}</p>
      <div className="notas-equipo"><label htmlFor="notas-equipo">Notas del equipo</label><p id="notas-ayuda">Anoten hipótesis y evidencias. No se envían al chat.</p><textarea id="notas-equipo" aria-describedby="notas-ayuda notas-estado" value={notas} onChange={e => escribir(e.target.value)} placeholder="Observamos…&#10;Nuestra hipótesis es…&#10;Lo comprobamos con…" /><div id="notas-estado" role="status">{guardado ? "Guardado en este navegador · este sector" : "No se pudieron guardar. Copia tus notas antes de salir."}</div></div>
    </section>
  );
}
