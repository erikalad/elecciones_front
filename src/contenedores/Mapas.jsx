import React from 'react';
import { useSelector } from 'react-redux';
import departamentos from './departamento.json'
import provincias from './provincia.json'
import MapaPais from './Mapa4';
import MapaDepartamentos from './Mapa5.jsx'

export default function Mapas({ dataMesas }) {
  const distrito = useSelector(state => state.distrito_mapa);
  // console.log(distrito);

  return (
    <>
      {distrito === "NACIONAL" && <MapaPais datos={provincias} dataMesas={dataMesas} /> }
      {distrito === "INTENDENTE" && <MapaDepartamentos datos={departamentos} dataMesas={dataMesas} /> }
    </>
  );
}