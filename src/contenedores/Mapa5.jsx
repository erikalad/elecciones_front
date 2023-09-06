/** @format */

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { scaleLinear } from "d3-scale";
import L from "leaflet";

const MapaDepartamentos = ({ datos, dataMesas }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [filteredData, setFilteredData] = useState(datos); // Inicializar con todos los datos
  const mapRef = useRef(null); // Referencia al MapContainer
  const [, forceUpdate] = useState();

  //  Transformar los datos en el formato necesario para la tabla
  // Convertir xmlData en un arreglo y mapear para obtener los datos necesarios
  const data = Array.from(dataMesas.getElementsByTagName("recuentoMesas")).map(
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
  const result = data.map((item) => {
    const mesasEsperadas = parseInt(item.mesasEsperadas);
    const mesasTotalizadas = parseInt(item.mesasTotalizadas);

    const porcentaje =
      mesasEsperadas !== 0 ? (mesasTotalizadas / mesasEsperadas) * 100 : 0;

    return { ...item, porcentaje };
  });

  const center = [-34.607568, -58.437089];

  // Función para ocultar el tooltip
  const handleMapClick = () => {
    setTooltipContent(null);
  };

  useEffect(() => {
    // console.log("CAMBIOS");
    setFilteredData(data);

    // Forzar actualización de la capa GeoJSON
    if (mapRef.current) {
      const map = mapRef.current.leafletElement;
      if (map) {
        map.eachLayer((layer) => {
          if (layer instanceof L.GeoJSON) {
            layer.clearLayers();
            layer.addData(filteredData); // Aquí es donde estás añadiendo los datos filtrados
          }
        });
      }
    }
  }, [dataMesas]);

  const getFeatureStyle = (feature) => {
    const provincesToHighlight = [
      "San Martín",
      "Lanús",
      "La Plata",
      "General San Martín",
      "Moreno",
      "La Matanza",
      "Hurlingham",
      "Tigre",
      "Tres de Febrero"
    ];

    const dataItem = result.find(
      (item) =>
        provincesToHighlight.includes(feature.properties.nam) &&
      (feature.properties.nam === "General San Martín" &&
        item.distrito === "SAN MARTÍN") ||
      (feature.properties.nam === "Lanús" &&
        item.distrito === "LANÚS") ||
      (feature.properties.nam === "La Plata" && item.distrito === "LA PLATA") ||
      (feature.properties.nam === "Moreno" &&
        item.distrito === "MORENO") ||
      (feature.properties.nam === "La Matanza" &&
        item.distrito === "LA MATANZA") ||
      (feature.properties.nam === "Hurlingham" && item.distrito === "HURLINGHAM") ||
      (feature.properties.nam === "Tres de Febrero" && item.distrito === "TRES DE FEBRERO") ||
      (feature.properties.nam === "Tigre" && item.distrito === "TIGRE") ||
      item.distrito === feature.properties.nam
  );

    if (dataItem) {
      const percentage =
        (parseFloat(dataItem.mesasTotalizadas) /
          parseFloat(dataItem.mesasEsperadas)) *
        100;
      const colorScale = scaleLinear()
        .domain([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
        .range([
          "#fffd9e",
          "#e9ff45",
          "#b7ff02",
          "#8cc400",
          "#67ff02",
          "#0fff02",
          "#22b900",
          "#1a8d00",
          "#126200",
          "#00450d",
          "#0a3600",
        ]); // Ajustar el rango de colores
      const color = colorScale(percentage);

      return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.5,
      };
    } else {
      return {
        fillColor: "transparent",
        weight: 0,
        opacity: 0,
        fillOpacity: 0,
      };
    }
  };

  const getFeaturePercentage = (feature) => {
    const dataItem = result.find(
      (item) =>
      (feature.properties.nam === "San Martín" &&
      item.distrito === "SAN MARTÍN") ||
    (feature.properties.nam === "Lanús" &&
      item.distrito === "LANÚS") ||
    (feature.properties.nam === "La Plata" && item.distrito === "LA PLATA") ||
    (feature.properties.nam === "Moreno" &&
      item.distrito === "MORENO") ||
    (feature.properties.nam === "La Matanza" &&
      item.distrito === "LA MATANZA") ||
    (feature.properties.nam === "Hurlingham" && item.distrito === "HURLINGAM") ||
    (feature.properties.nam === "Tigre" && item.distrito === "TIGRE") ||
    item.distrito === feature.properties.nam
    );

    if (dataItem) {
      return (
        (parseFloat(dataItem.mesasTotalizadas) /
          parseFloat(dataItem.mesasEsperadas)) *
        100
      );
    }

    return null;
  };

  const formatPopupContent = (feature) => {
    const percentage = getFeaturePercentage(feature);

    if (percentage !== null) {
      return `${feature.properties.nam}: ${percentage.toFixed(2)}%`;
    }

    return "No data available"; // O cualquier mensaje que desees mostrar si no hay datos disponibles
  };

  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={10}
        style={{ height: "1500px" }}
        dragging={true}
        scrollWheelZoom={true}
        zoomControl={false}
        onClick={handleMapClick}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={filteredData} // Utilizar directamente los datos filtrados
          style={getFeatureStyle}
          // onEachFeature={(feature, layer) => {
          //   const content = formatPopupContent(feature);
          //   layer.bindPopup(content);
          // }}
        />
      </MapContainer>
    </div>
  );
};

export default MapaDepartamentos;
