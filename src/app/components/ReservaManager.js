"use client";

import React, { useState , useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";


export default function ReservaManager() {
  const [reservas, setReservas] = useState([]);
  const [numGrupos, setNumGrupos] = useState(3);
  const [nombresGrupos, setNombresGrupos] = useState(["Grupo 1", "Grupo 2", "Grupo 3"]);
  const [grupos, setGrupos] = useState(Array.from({ length: numGrupos }, () => []));
  const [textoPlano, setTextoPlano] = useState("");
  const [asignaciones, setAsignaciones] = useState({});

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => console.log('Service Worker registrado:', registration))
        .catch(error => console.log('Error al registrar el Service Worker:', error));
    }
  }, []);


  const procesarTexto = () => {
    const lineas = textoPlano.split("\n").filter((line) => line.trim() !== "");
    const nuevasReservas = lineas.map((line) => {
      const partes = line.trim().split(/\s{2,}/);
      return { nombre: partes[0], personas: parseInt(partes[1]) || 1, presente: false };
    }).sort((a, b) => a.nombre.localeCompare(b.nombre));
    
    setReservas(nuevasReservas);
    setGrupos(Array.from({ length: numGrupos }, () => []));
    setAsignaciones({});
  };

  const asignarAGrupo = (reserva, index) => {
    let gruposTemp = [...grupos];
    let conteoPersonas = gruposTemp.map((g) => g.reduce((acc, r) => acc + r.personas, 0));
    let indexMenor = conteoPersonas.indexOf(Math.min(...conteoPersonas));
    gruposTemp[indexMenor].push(reserva);
    setGrupos(gruposTemp);
    setAsignaciones((prev) => ({ ...prev, [index]: nombresGrupos[indexMenor] }));

  };

  const togglePresente = (index) => {
    let updated = [...reservas];
    updated[index].presente = !updated[index].presente;
    setReservas(updated);
    
    if (updated[index].presente) {
        asignarAGrupo(updated[index], index);
    } else {
      setAsignaciones((prev) => {
        const newAsignaciones = { ...prev };
        delete newAsignaciones[index];
        return newAsignaciones;
      });
    }
  };

  const actualizarNumGrupos = (e) => {
    const nuevoNum = parseInt(e.target.value) || 1;
    setNumGrupos(nuevoNum);
    setNombresGrupos(Array.from({ length: nuevoNum }, (_, i) => `Grupo ${i + 1}`));
    setGrupos(Array.from({ length: nuevoNum }, () => []));
    setAsignaciones({});

  };

  const actualizarNombreGrupo = (index, nuevoNombre) => {
    let nuevosNombres = [...nombresGrupos];
    nuevosNombres[index] = nuevoNombre;
    setNombresGrupos(nuevosNombres);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-gray-100 rounded-lg shadow-lg">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
        rows="5"
        value={textoPlano}
        onChange={(e) => setTextoPlano(e.target.value)}
        placeholder="Pega aquí la lista de reservas"
      />
      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={procesarTexto}>Procesar Reservas</Button>

      <div className="space-y-2">
        <label className="block text-lg font-medium">Número de grupos:</label>
        <input
          type="number"
          className="border p-2 rounded w-20 shadow-sm focus:ring focus:ring-indigo-300"
          value={numGrupos}
          onChange={actualizarNumGrupos}
          min="1"
        />
      </div>

      <div className="space-y-3">
        {reservas.map((reserva, index) => (
          <div key={index} className="flex items-center space-x-4 bg-white p-3 rounded-lg shadow">
            <Checkbox
              checked={reserva.presente}
              onCheckedChange={() => togglePresente(index)}
            />
            <span className="text-lg font-medium">
              {reserva.nombre} ({reserva.personas} personas)
            </span>
            {asignaciones[index] && <span className="text-green-600 font-semibold">(Asignado con {asignaciones[index]})</span>}

          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {grupos.map((grupo, i) => (
          <Card key={i} className="bg-white shadow-lg rounded-lg p-4">
            <CardContent>
              <input
                className="text-lg font-bold border p-2 w-full rounded-lg shadow-sm focus:ring focus:ring-indigo-300"
                value={nombresGrupos[i]}
                onChange={(e) => actualizarNombreGrupo(i, e.target.value)}
              />
              <ul className="mt-2 space-y-1">
                {grupo.map((reserva, j) => (
                  <li key={j} className="text-gray-700">{reserva.nombre} ({reserva.personas})</li>
                ))}
              </ul>
              <p className="mt-2 text-lg font-semibold text-indigo-700">
                Total: {grupo.reduce((acc, r) => acc + r.personas, 0)} personas
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
