import React, { useEffect, useState } from 'react';
import XMLParser from 'react-xml-parser';
import RecuentoMesas from './../contenedores/RecuentoMesas'
import ResultadosVotos from '../contenedores/ResultadosVotos';
import './Landing.css'
import { Tabs, Tooltip } from 'antd';
import Footer from '../contenedores/Footer';
import MenuLateral from '../contenedores/Menu';
import Mapas from '../contenedores/Mapas';
import inicial from './../xml/prueba.xml'
import { Switch, Button } from 'antd';
import Indicadores from '../contenedores/Indicadores';
import { Progress, Space } from 'antd';
const { TabPane } = Tabs;

export default function Landing() {
    const [xmlData, setXmlData] = useState(null);
    const [xmlDataResult, setXmlDataResult] = useState(null);
    const [xmlDataResultCABA, setXmlDataResultCABA] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://apielecciones-l5tm.onrender.com/resultados');
          // const response = await fetch('http://localhost:3000/resultados')
          const xml = await response.text();
          const parsedXML = new XMLParser().parseFromString(xml);
          setXmlDataResult(parsedXML);
        } catch (error) {
          // En caso de error, puedes manejarlo como desees
          console.error('Error fetching resultados:', error);
        }
      };
      const fetchDataCABA = async () => {
        try {
          const response = await fetch('https://apielecciones-l5tm.onrender.com/resultadosCABA');
          // const response = await fetch('http://localhost:3000/resultadosCABA')
          const xml = await response.text();
          const parsedXML = new XMLParser().parseFromString(xml);
          // Concatenar la nueva data con el estado actual de xmlDataResult
          setXmlDataResultCABA(parsedXML);
        } catch (error) {
          // En caso de error, puedes manejarlo como desees
          console.error('Error fetching resultados CABA:', error);
        }
      };
    
      const fetchDataMesas = async () => {
        try {
          const response = await fetch('https://apielecciones-l5tm.onrender.com/mesas');
          // const response = await fetch('http://localhost:3000/mesas')
          const xml = await response.text();
          const parsedXML = new XMLParser().parseFromString(xml);
          setXmlData(parsedXML);
        } catch (error) {
          // En caso de error, puedes manejarlo como desees
          console.error('Error fetching mesas:', error);
        }
      };
    
      const fetchPeriodically = () => {
        try {
          fetchData();
          fetchDataMesas();
          fetchDataCABA()
        } catch (error) {
          // En caso de error, puedes manejarlo como desees
          console.error('Error fetching data:', error);
        }
      
        setTimeout(fetchPeriodically, 20000);
      };
      
      fetchPeriodically();
      // console.log(xmlData);
      
      return () => {
        // Limpia todos los timeouts pendientes al desmontar el componente
        clearTimeout();
      };
    }, []);


  useEffect(() => {
    fetch(inicial)
      .then(response => response.text())
      .then(xml => {
        const parsedXML = new XMLParser().parseFromString(xml);
        //  console.log("INICIAL",parsedXML)
        setXmlData(parsedXML);
      })

  }, [inicial]); // Asegúrate de incluir las dependencias en el array de dependencias para que los efectos se ejecuten cuando cambien.




  const handleIniciarCiclo = async () => {
    try {
      const response = await fetch('https://apielecciones-l5tm.onrender.com/iniciar-ciclo', { method: 'POST' });
      // const response = await fetch('http://localhost:3000/iniciar-ciclo', { method: 'POST' });
    } catch (error) {
      console.error('Error al iniciar el ciclo:', error);
    }
  };

  const handleDetenerCiclo = async () => {
    try {
      const response = await fetch('https://apielecciones-l5tm.onrender.com/detener-ciclo', { method: 'POST' });
      // const response = await fetch('http://localhost:3000/detener-ciclo', { method: 'POST' });
    } catch (error) {
      console.error('Error al detener el ciclo:', error);
    }
  };

  let data = []
  if(xmlData !== null){
     data = Array.from(xmlData.getElementsByTagName('recuentoMesas')).map(
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
  }

   // Calcular totales y porcentaje totalizado
   const totalMesasEsperadas = data.reduce((total, item) => total + item.mesasEsperadas, 0);
   const totalMesasTotalizadas = data.reduce((total, item) => total + item.mesasTotalizadas, 0);
   const totalPorcentajeTotalizado = ((totalMesasTotalizadas / totalMesasEsperadas) * 100).toFixed(2);


// Filtrar los registros solo para el distrito NACIONAL
const dataDistritoNacional = data.filter((item) => item.distrito === 'NACIONAL');
// Calcular el total de mesasEsperadas para el distrito NACIONAL
const totalMesasEsperadasNacional = dataDistritoNacional.reduce((total, item) => total + item.mesasEsperadas, 0);
// Calcular el total de mesasTotalizadas para el distrito NACIONAL
const totalMesasTotalizadasNacional = dataDistritoNacional.reduce((total, item) => total + item.mesasTotalizadas, 0);


// Filtrar los registros excluyendo el distrito NACIONAL
const dataOtrosDistritos = data.filter((item) => item.distrito !== 'NACIONAL' && item.nivel === 'PRESIDENTE');
// Calcular el total de mesasEsperadas para los distritos excluyendo NACIONAL
const totalMesasEsperadasOtrosDistritos = dataOtrosDistritos.reduce((total, item) => total + item.mesasEsperadas, 0);
// Calcular el total de mesasTotalizadas para los distritos excluyendo NACIONAL
const totalMesasTotalizadasOtrosDistritos = dataOtrosDistritos.reduce((total, item) => total + item.mesasTotalizadas, 0);

//Progresos
const progres1 = ((totalMesasEsperadasNacional / totalMesasEsperadasOtrosDistritos) * 100).toFixed(2);
const progres2= ((totalMesasTotalizadasNacional / totalMesasTotalizadasOtrosDistritos) * 100).toFixed(2);
const progres3= ((totalMesasTotalizadasNacional / totalMesasEsperadasNacional) * 100).toFixed(2);
  
    return (
      <div  className='landing'>
         <MenuLateral/>
      <div >
     
     <div className='switch'>
  
          <Button onClick={handleIniciarCiclo} style={{marginRight:"1rem"}}>
            Iniciar
          </Button>
          <Button onClick={handleDetenerCiclo}>
            Detener
          </Button>
  
    </div>
  
        <div className='pagina'>
      <div className='progreso'>
        <div className='titulo-carta'>Elecciones 2023</div>
       <div className='progresos-varios'> 
       <div className='progreso-carta'>
       <Tooltip title="Total de mesas esperadas nacional/provincias">
        <Progress
  className='progreso-circle'
  type="circle"
  size={[110, 110]}
  percent={isNaN(progres1) ? 0 : parseFloat(progres1)}
  strokeColor={{
    '0%': '#108ee9',
    '100': '#87d068',
  }}
/></Tooltip>
</div>
<div className='progreso-carta'>
  <Tooltip title="Total mesas totalizadas nacional/provincias">
<Progress
  className='progreso-circle'
  type="circle"
  size={[110, 110]}
  percent={isNaN(progres2) ? 0 : parseFloat(progres2)}
  strokeColor={{
    '0%': '#108ee9',
    '100': '#87d068',
  }}
/>
</Tooltip>
</div>

<div className='progreso-carta'>
<Tooltip title="Porcentaje de recuento">
<Progress
  className='progreso-circle'
  type="circle"
  size={[110, 110]}
  percent={isNaN(progres3) ? 0 : parseFloat(progres3)}
  strokeColor={{
    '0%': '#108ee9',
    '100': '#87d068',
  }}
/></Tooltip>
</div>
</div>
     </div>
        <Tabs type="card">
     
        <TabPane tab="Recuento Mesas" key="1">
         

        <div className='landing-cartas'>
        {xmlData ? (
            <RecuentoMesas xmlData={xmlData}/>
          
        ) : (
          <p>Cargando el XML...</p>
        )}
        </div>
          </TabPane>
          <TabPane tab="Valores Totalizados" key="2">
          <div className='landing-cartas'>
        {xmlDataResult ? (
            <ResultadosVotos xmlDataResult={xmlDataResult} xmlDataResultCABA={xmlDataResultCABA} />
        ) : (
          <p>Cargando el XML...</p>
        )}
        </div>
         </TabPane>

         <TabPane tab="Mapa Recuento Mesas" key="3">
          <Mapas dataMesas={xmlData}/>
        

         </TabPane>
         <TabPane tab="Indicadores Votos" key="4">
          <Indicadores xmlData={xmlData} xmlDataResult={xmlDataResult} xmlDataResultCABA={xmlDataResultCABA}/>
        

         </TabPane>
        </Tabs>
        </div>
        <Footer/>
      </div>
   
    </div>
    );
}