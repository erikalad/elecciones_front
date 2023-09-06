import { Table } from 'antd';
import './index.css'
import { useSelector } from 'react-redux';
import React from 'react';


function ResultadosVotos({xmlDataResult, xmlDataResultCABA}) {
  const cargo = useSelector(state => state.cargo);
  const distrito = useSelector(state => state.distrito)
  if (!xmlDataResult || xmlDataResult.length === 0) {
    return <p>Cargando el XML...</p>;
  }
  

  // Convertir xmlDataResult en un arreglo y mapear para obtener los datos necesarios
  const processXmlData = (xmlData) => {
    // console.log("DATA QUE LLEGA",xmlData)
  const data = Array.from(xmlData.getElementsByTagName('valoresTotalizados')).map(
    (recuentoMesa, index) => {
      const cargo = recuentoMesa.children.find(child => child.name === 'cargo').value;
      const distrito = recuentoMesa.children.find(child => child.name === 'distrito').value;
      const nombreAgrupacion = recuentoMesa.children.find(child => child.name === 'nombreAgrupacion').value;
      const sigla = recuentoMesa.children.find(child => child.name === 'sigla').value;
      const votos = recuentoMesa.children.find(child => child.name === 'votos').value;
  
      return {
        key: index,
        cargo,
        distrito,
        nombreAgrupacion,
        sigla,
        votos,
        listas: Array.from(recuentoMesa.getElementsByTagName('listas')).map((lista) => ({
          apellidoCandidato: lista.children.find(child => child.name === 'apellidoCandidato').value,
          votosLista: lista.children.find(child => child.name === 'votosLista').value,
        })),
      };
    }
    
  );
  return data;
  }
 
 // Procesar ambos conjuntos de datos XML y combinarlos
 const processedData = processXmlData(xmlDataResult);
// console.log("processedData",processedData)
 // Filtrar los datos combinados en base a cargo y distrito
 const filteredData = processedData.filter(item => {
   return (!cargo || item.cargo === cargo) && (!distrito || item.distrito === distrito);
 });
 const totalVotosPorCargo = {};

 filteredData.forEach((item) => {
   const cargo = item.cargo;
   const votos = parseInt(item.votos);
 
   if (!totalVotosPorCargo[cargo]) {
     totalVotosPorCargo[cargo] = votos;
   } else {
     totalVotosPorCargo[cargo] += votos;
   }
 });

 const porcentajePorAgrupacion = {};

filteredData.forEach((item) => {
  const cargo = item.cargo;
  const votos = parseInt(item.votos);
  const nombreAgrupacion = item.nombreAgrupacion;

  if (!porcentajePorAgrupacion[cargo]) {
    porcentajePorAgrupacion[cargo] = {};
  }

  if (!porcentajePorAgrupacion[cargo][nombreAgrupacion]) {
    porcentajePorAgrupacion[cargo][nombreAgrupacion] = (votos / totalVotosPorCargo[cargo]) * 100;
  }
});

console.log(porcentajePorAgrupacion)
  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'Nombre Agrupación',
      dataIndex: 'nombreAgrupacion',
      key: 'nombreAgrupacion',
      width: 150, // Ancho de la columna 'Nombre Agrupación'
      sorter: (a, b) => a.nombreAgrupacion.localeCompare(b.nombreAgrupacion),
      sortDirections: ["ascend", "descend"],
      filters: filteredData.map((item) => ({ text: item.nombreAgrupacion, value: item.nombreAgrupacion})),
      filterMultiple: true, // Puedes ajustar esto según tus preferencias
      onFilter: (value, record) => record.nombreAgrupacion === value,
      filterMode: 'tree',
      filterSearch: true,
    },
    {
      title: 'Distrito',
      dataIndex: 'distrito',
      key: 'distrito',
      width: 150, // Ancho de la columna 'Distrito'
    },
    {
      title: 'Sigla',
      dataIndex: 'sigla',
      key: 'sigla',
      width: 100, // Ancho de la columna 'Sigla'
    },
    {
      title: 'Votos',
      dataIndex: 'votos',
      key: 'votos',
      width: 100, // Ancho de la columna 'Votos'
      sorter: (a, b) => a.votos - b.votos,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: 'Porcentaje',
      dataIndex: 'porcentaje',
      key: 'porcentaje',
      sorter: (a, b) => a.porcentaje - b.porcentaje,
      sortDirections: ["descend", "ascend"],
      width: 100,
      render: (_, record) => {
        const porcentaje = porcentajePorAgrupacion[record.cargo][record.nombreAgrupacion];
        const formattedPorcentaje = Number.isNaN(porcentaje) ? '0%' : `${porcentaje.toFixed(2)}%`;
        return <span>{formattedPorcentaje}</span>;
      },
    },
  ];

  function ListasComponent({ listas }) {
    const columns = [
      {
        title: 'Candidato',
        dataIndex: 'apellidoCandidato',
        key: 'apellidoCandidato',
      },
      {
        title: 'Votos',
        dataIndex: 'votosLista',
        key: 'votosLista',
      },
    ];
  
    return (
      <div>
        <Table columns={columns} dataSource={listas} pagination={false} />
      </div>
    );
  }

  return (
    <div>
      {filteredData ? <h3>{filteredData[0]?.cargo}</h3> : null}
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        className='tabla-votos'
        scroll={{ x: 100 }}
        expandedRowRender={(record) => (
          <div>
            <ListasComponent listas={record.listas} />
          </div>
        )}
      />
  
      {/* Totalizador */}
      <div className='totalizador'>
        <p>Total Votos: {totalVotosPorCargo[cargo] || 0}</p>
      </div>
    </div>
  );
        }

export default ResultadosVotos;