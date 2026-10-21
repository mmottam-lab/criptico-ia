"use client";
import { useEffect, useState } from "react";
import { EJEMPLOS, PRUEBAS, entrenar, predecir, aciertos, type Pieza, type Modelo } from "@/lib/robot";
const KEY = "archivo2036:robot:v1";
function Figura({pieza}: {pieza:Pieza}) {
  return <svg className={`robot-pieza ${pieza.color}`} viewBox="0 0 64 50" role="img" aria-label={`${pieza.forma === "triangulo" ? "Triángulo" : "Círculo"} ${pieza.color}`}><title>{pieza.forma} {pieza.color}</title>{pieza.forma === "triangulo" ? <path d="M32 5 58 45H6Z"/> : <circle cx="32" cy="25" r="21"/>}</svg>;
}
export default function EntrenaRobot({completar}: {completar:()=>void}) {
  const [etiquetas,setEtiquetas] = useState<Record<number,boolean>>({});
  const [ampliado,setAmpliado] = useState(false);
  const [modelo,setModelo] = useState<Modelo|null>(null);
  const [probado,setProbado] = useState(false);
  const [error,setError] = useState(false);
  useEffect(() => { try { const p=JSON.parse(localStorage.getItem(KEY) || "null"); if(p && typeof p.etiquetas === "object" && p.etiquetas && !Array.isArray(p.etiquetas)) { const e:Record<number,boolean>={}; EJEMPLOS.forEach(x=>{if(typeof p.etiquetas[x.id]==="boolean") e[x.id]=p.etiquetas[x.id];}); setEtiquetas(e); setAmpliado(p.ampliado===true); } } catch {} },[]);
  const piezas = EJEMPLOS.slice(0,ampliado?8:4);
  function guardar(e:Record<number,boolean>, a:boolean) { try { localStorage.setItem(KEY,JSON.stringify({etiquetas:e,ampliado:a}));setError(false); }catch{setError(true);} }
  function etiquetar(id:number, valor:boolean) { const e={...etiquetas,[id]:valor};setEtiquetas(e);setModelo(null);setProbado(false);guardar(e,ampliado); }
  const listo=piezas.every(p=>typeof etiquetas[p.id]==="boolean");
  const resultado=modelo ? aciertos(modelo):0;
  return <section className="panel panel-reto robot-lab" aria-label="Entrena al robot" tabIndex={0}>
    <p className="eyebrow">Laboratorio / Aprender con ejemplos</p><h2>Entrena al robot</h2>
    <p className="intro">Su misión: enseñarle a <strong>recuperar triángulos</strong> y <strong>dejar círculos</strong>, de cualquier color.</p>
    <p className="robot-step">01 Etiqueten {piezas.length} ejemplos</p>
    <div className="robot-ejemplos">{piezas.map(p=><div className="robot-ejemplo" key={p.id}><Figura pieza={p}/><span>Ejemplo {p.id+1}</span><div>{[[true,"Recuperar"],[false,"Dejar"]].map(([v,t])=><button key={String(v)} type="button" aria-label={`${t} ejemplo ${p.id+1}`} aria-pressed={etiquetas[p.id]===v} onClick={()=>etiquetar(p.id,v as boolean)}>{t}</button>)}</div></div>)}</div>
    <button className="mission-button" disabled={!listo} onClick={()=>{setModelo(entrenar(etiquetas));setProbado(false);}}>02 {modelo ? "Volver a entrenar" : "Entrenar robot"}</button>
    {modelo && <><p className="intro">Robot entrenado. ¿Qué creen que hará con piezas de otro color?</p><button className="ghost" onClick={()=>setProbado(true)}>03 Probar con piezas nuevas</button></>}
    {probado && modelo && <div className="robot-resultados" role="status"><h3>{resultado} de 4 aciertos</h3><div className="robot-pruebas">{PRUEBAS.map(p=><div key={p.id}><Figura pieza={p}/><span>{predecir(modelo,p)?"Recuperar":"Dejar"}</span><strong>{predecir(modelo,p)===(p.forma==="triangulo")?"✓ Acierto":"× Error"}</strong></div>)}</div><p>La regla aprendida se fija en <strong>{modelo.atributo==="color"?"el color":"la forma"}</strong>. {resultado<4?"Comparen los errores con los ejemplos: ¿qué falta o qué etiqueta cambiarían?":"Funciona en estas cuatro pruebas. Eso no garantiza acertar cualquier objeto del mundo."}</p>
    {!ampliado && <button className="mission-button" onClick={()=>{setAmpliado(true);setModelo(null);setProbado(false);guardar(etiquetas,true);}}>Añadir ejemplos variados</button>}
    {ampliado && resultado===4 && <><p className="robot-recompensa">Fragmento recuperado: <strong>SEMILLA</strong>. Guárdenlo en sus notas para el guardián.</p><button className="mission-button" onClick={completar}>Comprobar lo aprendido →</button></>}
    </div>}
    {error && <p role="alert">No se pudo guardar el entrenamiento en este navegador.</p>}
  </section>;
}
