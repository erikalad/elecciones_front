import React from "react";
import { Table } from 'antd';

function RecuentoMesas({ xmlData }) {

    if (!xmlData || xmlData.length === 0) {
      return <p>Cargando el XML...</p>;
    }
  
   
    // Transformar los datos en el formato necesario para la tabla
     // Convertir xmlData en un arreglo y mapear para obtener los datos necesarios
     const data = Array.from(xmlData.getElementsByTagName('recuentoMesas')).map(
      (recuentoMesa, index) => {
        const mesasEsperadas = parseFloat(recuentoMesa.children.find(child => child.name === 'mesasEsperadas').value);
        const mesasTotalizadas = parseFloat(recuentoMesa.children.find(child => child.name === 'mesasTotalizadas').value);
        const porcentajeTotalizado = ((mesasTotalizadas / mesasEsperadas) * 100).toFixed(2);
        
        return {
          key: index,
          distrito: recuentoMesa.children.find(child => child.name === 'distrito').value,
          nivel: recuentoMesa.children.find(child => child.name === 'nivel').value,
          mesasEsperadas: mesasEsperadas,
          mesasTotalizadas: mesasTotalizadas,
          porcentajeTotalizado: porcentajeTotalizado,
        };
      }
    );
  
  // Ordenar el arreglo de data por el campo "Distrito" en orden alfabético
  data.sort((a, b) => a.distrito.localeCompare(b.distrito));
  //  console.log(data)
   const uniqueDistritos = Array.from(new Set(data.map((item) => item.distrito)));
  // console.log(uniqueDistritos)
  const columns = [
    {
      title: "Distrito",
      dataIndex: "distrito",
      key: "distrito",
      fixed: "left",
      width: "20%",
      sorter: (a, b) => a.distrito.localeCompare(b.distrito),
      sortDirections: ["ascend", "descend"],
      filters: uniqueDistritos.map((item) => ({ text: item, value: item})),
      filterMultiple: true, // Puedes ajustar esto según tus preferencias
      onFilter: (value, record) => record.distrito === value,
      filterMode: 'tree',
        filterSearch: true,
     },
    {
      title: 'Nivel',
      dataIndex: 'nivel',
      key: 'nivel',
      width: '15%',
    },
    {
      title: 'Mesas Esperadas',
      dataIndex: 'mesasEsperadas',
      key: 'mesasEsperadas',
      width: '20%',
      sorter: (a, b) => a.mesasEsperadas - b.mesasEsperadas,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: 'Mesas Totalizadas',
      dataIndex: 'mesasTotalizadas',
      key: 'mesasTotalizadas',
      width: '20%',
      sorter: (a, b) => a.mesasTotalizadas - b.mesasTotalizadas,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: '% Totalizado',
      dataIndex: 'porcentajeTotalizado',
      key: 'porcentajeTotalizado',
      width: '25%',
      sorter: (a, b) => a.porcentajeTotalizado - b.porcentajeTotalizado,
      sortDirections: ["ascend", "descend"],
      render: (porcentaje) => `${porcentaje}%`,
    },
  ];
  
  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className='tabla-votos'
        scroll={{
          x: 400, // O ajusta un valor específico en píxeles según tus necesidades
        }}
      />
    </div>
  );
  }

export default RecuentoMesas