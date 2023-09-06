import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import './index.css';
import { useDispatch, useSelector } from 'react-redux';
import img32 from './../ele20232.png';
import XMLParser from 'react-xml-parser';
import xmlUrl3 from './../xml/resultados_CABA.xml'
import { selectDistrito, filtrarInformacion, selectDistritoMapa } from './../redux/actions.js';

const MenuLateral = () => {
  const [xmlData, setXmlData] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsMesas, setItemsMesas] = useState([]);
  const [itemsCABA, setItemsCaba] = useState([])
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const dispatch = useDispatch();
  const [current, setCurrent] = useState('1');
 
 

  useEffect(() => {
    const fetchData = async () => {
      try {
    fetch('https://apielecciones-l5tm.onrender.com/resultados')
    // fetch('http://localhost:3000/resultados')
      .then(response => response.text())
      .then(xml => {
        const parsedXML = new XMLParser().parseFromString(xml);
        setXmlData(parsedXML);

        const distritos = Array.from(parsedXML.getElementsByTagName('distrito')).map((node) => node.value);
        setSelectedDistrito(distritos[0]);

        const result = Array.from(parsedXML.getElementsByTagName('valoresTotalizados')).map(
          (recuentoMesa, index) => {
            const cargo = recuentoMesa.children.find(child => child.name === 'cargo').value;
            const distrito = recuentoMesa.children.find(child => child.name === 'distrito').value;
            return {
              key: index,
              title: cargo,
              distrito: distrito
            };
          }
        );

        const uniqueItems = result.reduce((acc, current) => {
          const existingItem = acc.find((item) => item.title === current.title);
          if (!existingItem) {
            acc.push({
              key: current.key,
              title: current.title,
              distritos: [current.distrito],
            });
          } else {
            if (!existingItem.distritos.includes(current.distrito)) {
              existingItem.distritos.push(current.distrito);
            }
          }
          return acc;
        }, []);

        setItems(uniqueItems);
      });
    }
    catch (error) {
      // En caso de error, puedes manejarlo como desees
      console.error('Error fetching CABA:', error);
    }
    }




    /////////////////////PROXIMAMENTE CON LEGISLADORES////////////////////////////////////
    const fetchDataCABA = async () => {
      try {
        fetch('https://apielecciones-l5tm.onrender.com/resultadosCABA')
        // fetch('http://localhost:3000/resultadosCABA')
      .then(response => response.text())
      .then(xml => {
        const parsedXML = new XMLParser().parseFromString(xml);
        setXmlData(parsedXML);

        const distritos = Array.from(parsedXML.getElementsByTagName('distrito')).map((node) => node.value);
        setSelectedDistrito(distritos[0]);

        const result = Array.from(parsedXML.getElementsByTagName('valoresTotalizados')).map(
          (recuentoMesa, index) => {
            const cargo = recuentoMesa.children.find(child => child.name === 'cargo').value;
            const distrito = recuentoMesa.children.find(child => child.name === 'distrito').value;
            return {
              key: index,
              title: cargo,
              distrito: distrito
            };
          }
        );

        const uniqueItems = result.reduce((acc, current) => {
          const existingItem = acc.find((item) => item.title === current.title);
          if (!existingItem) {
            acc.push({
              key: current.key,
              title: current.title,
              distritos: [current.distrito],
            });
          } else {
            if (!existingItem.distritos.includes(current.distrito)) {
              existingItem.distritos.push(current.distrito);
            }
          }
          return acc;
        }, []);

        setItemsCaba(uniqueItems);
      });
    }
      catch (error) {
        // En caso de error, puedes manejarlo como desees
        console.error('Error fetching CABA:', error);
      }
    }

    const fetchDataMesas = async () => {
      try{
      fetch('https://apielecciones-l5tm.onrender.com/mesas')
      // fetch('http://localhost:3000/mesas')
      .then(response => response.text())
      .then(xml => {
        const parsedXML = new XMLParser().parseFromString(xml);
        setXmlData(parsedXML);
    
        const result = Array.from(parsedXML.getElementsByTagName('recuentoMesas')).map(
          (recuentoMesa, index) => {
            const distrito = recuentoMesa.children.find(child => child.name === 'distrito').value;
            return {
              key: index,
              distrito: distrito,
            };
          }
        );
          // console.log(result)
        setItemsMesas(result);
      });
    }
      catch (error) {
        // En caso de error, puedes manejarlo como desees
        console.error('Error fetching CABA:', error);
      }
    }


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

 

  return (
    <>
   
  <div className='menu-landing'>
  <img src={img32} className='imgele3' />
      <Menu
      style={{
        background: 'transparent',
        width: '100%',
      }}
      defaultOpenKeys={['sub1']}
      selectedKeys={[current]}
      mode='inline'
      className='menu-background'
    >
<Menu.SubMenu title={`VALORES TOTALIZADOS (${items.length + itemsCABA.length})`} >
  {items.map((item) => (
    <Menu.SubMenu key={`item-${item.key}`} title={`${item.title} (${item.distritos.length})`}>
      {item.distritos.map((distrito, index) => (
        <Menu.Item
          key={`item-${item.key}-${index}`}
          onClick={() => {
            setSelectedDistrito(distrito);
            dispatch(selectDistrito(item.title, distrito));
          }}
        >
          {distrito}
        </Menu.Item>
      ))}
    </Menu.SubMenu>
  ))}
  {itemsCABA.map((item) => (
    <Menu.SubMenu key={`itemCABA-${item.key}`} title={`${item.title} (${item.distritos.length})`}>
      {item.distritos.map((distrito, index) => (
        <Menu.Item
          key={`itemCABA-${item.key}-${index}`}
          onClick={() => {
            setSelectedDistrito(distrito);
            dispatch(selectDistrito(item.title, distrito));
          }}
        >
          {distrito}
        </Menu.Item>
      ))}
    </Menu.SubMenu>
  ))}
</Menu.SubMenu>

<Menu.SubMenu title='MAPA' key='otrosSubMenu'>
          <Menu.Item
            key='item-nacional'
            onClick={() =>  dispatch(selectDistritoMapa('NACIONAL'))} // Maneja el clic en NACIONAL
          >
            NACIONAL
          </Menu.Item>
          <Menu.Item
            key='item-intendente'
            onClick={() =>  dispatch(selectDistritoMapa('INTENDENTE'))} // Maneja el clic en INTENDENTE
          >
            INTENDENTE
          </Menu.Item>
        </Menu.SubMenu>
        

    </Menu>
    
      </div>
    </>
  );
};

export default MenuLateral;