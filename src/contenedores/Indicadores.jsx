/** @format */

import {
  AiFillCaretUp,
  AiFillCaretRight,
  AiFillCaretDown,
} from "react-icons/ai";
import { Card } from "antd";
import React, { useEffect, useState } from "react";
import "./index.css";
import { useSelector } from "react-redux";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Indicadores({
  xmlDataResult,
  xmlData,
  xmlDataResultCABA,
}) {
  const cargoSelect = useSelector((state) => state.cargo);
  const distritoSelect = useSelector((state) => state.distrito);

  const [prevVotesMap, setPrevVotesMap] = useState(new Map());
  //  Transformar los datos en el formato necesario para la tabla
  // Convertir xmlData en un arreglo y mapear para obtener los datos necesarios
  const data = Array.from(xmlData.getElementsByTagName("recuentoMesas")).map(
    (recuentoMesa, index) => ({
      key: index,
      distrito: recuentoMesa.children.find((child) => child.name === "distrito")
        .value,
      nivel: recuentoMesa.children.find((child) => child.name === "nivel")
        .value,
      mesasEsperadas: recuentoMesa.children.find(
        (child) => child.name === "mesasEsperadas"
      ).value,
      mesasTotalizadas: recuentoMesa.children.find(
        (child) => child.name === "mesasTotalizadas"
      ).value,
    })
  );

  // Convertir xmlDataResult en un arreglo y mapear para obtener los datos necesarios
  const processXmlData = (dat) => {
    // console.log("DATA QUE LLEGA",xmlData)
    const dataVotos = Array.from(
      dat.getElementsByTagName("valoresTotalizados")
    ).map((recuentoMesa, index) => {
      const cargo = recuentoMesa.children.find(
        (child) => child.name === "cargo"
      ).value;
      const distrito = recuentoMesa.children.find(
        (child) => child.name === "distrito"
      ).value;
      const nombreAgrupacion = recuentoMesa.children.find(
        (child) => child.name === "nombreAgrupacion"
      ).value;
      const sigla = recuentoMesa.children.find(
        (child) => child.name === "sigla"
      ).value;
      const votos = recuentoMesa.children.find(
        (child) => child.name === "votos"
      ).value;

      return {
        key: index,
        cargo,
        distrito,
        nombreAgrupacion,
        sigla,
        votos,
        listas: Array.from(recuentoMesa.getElementsByTagName("listas")).map(
          (lista) => ({
            apellidoCandidato: lista.children.find(
              (child) => child.name === "apellidoCandidato"
            ).value,
            votosLista: lista.children.find(
              (child) => child.name === "votosLista"
            ).value,
          })
        ),
      };
    });
    return dataVotos;
  };

  

  // Procesar ambos conjuntos de datos XML y combinarlos
  const processedData = processXmlData(xmlDataResult);
  const datosCaba = processXmlData(xmlDataResultCABA);

  // Combine the data arrays
  const combinedData = [...processedData, ...datosCaba];

  // Sort the combined data by 'votos' property in descending order
  const sortedCombinedData = combinedData.sort((a, b) => b.votos - a.votos);

  useEffect(() => {
    // Calculate prevVotesMap only when sortedCombinedData changes
    const newPrevVotes = new Map();
    sortedCombinedData.forEach((item) => {
      newPrevVotes.set(item.key, item.votos); // Store the previous votes for each item
    });

    // Only update the state if the previous votes have actually changed
    if (!areMapsEqual(prevVotesMap, newPrevVotes)) {
      setPrevVotesMap(newPrevVotes);
    }
  }, [sortedCombinedData, prevVotesMap]);

  function areMapsEqual(map1, map2) {
    if (map1.size !== map2.size) {
      return false;
    }
    for (const [key, value] of map1) {
      if (!map2.has(key) || map2.get(key) !== value) {
        return false;
      }
    }
    return true;
  }


  const totalVotes = sortedCombinedData
  .filter(item => item.cargo === cargoSelect && item.distrito === distritoSelect)
  .reduce((total, item) => total + parseInt(item.votos), 0);

  return (
    <div className="contenedor-indicadores">
      <h3>
        {cargoSelect} {distritoSelect}
      </h3>

      <TransitionGroup className="contenedor-indicadores">
  {sortedCombinedData.map(
    (item) =>
      // Verifica si el cargo y distrito coinciden antes de renderizar
      item.cargo === cargoSelect &&
      item.distrito === distritoSelect && (
        <CSSTransition
          key={item.key}
          timeout={300}
          classNames="transicion-tarjeta">
          <Card
            title={
              <div style={{ fontSize: '30px' }}>
               
                {item.votos > prevVotesMap.get(item.key) ? (
                  <AiFillCaretUp style={{ color: 'green', marginLeft: '5px' }} />
                ) : item.votos < prevVotesMap.get(item.key) ? (
                  <AiFillCaretDown style={{ color: 'red', marginLeft: '5px' }} />
                ) : (
                  <AiFillCaretRight style={{ color: 'gray', marginLeft: '5px' }} />
                )}
                {totalVotes === 0 ? "0" : ((parseInt(item.votos) / totalVotes) * 100).toFixed(2)}%
              </div>
            }
            className="carta-indicador"
          >
            <div style={{ fontSize: '25px' }}>
            {item.votos} Votos
            </div>
            <div style={{ fontSize: '15px' }}>
              {item.nombreAgrupacion}
              
            </div>
            
          </Card>
        </CSSTransition>
      )
  )}
</TransitionGroup>
    </div>
  );
}
