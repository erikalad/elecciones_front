/** @format */

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { scaleLinear } from "d3-scale";
import { Button } from "antd";
import { useSelector } from "react-redux";
import L from "leaflet";

const MapaPais = ({ datos, dataMesas }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [filteredData, setFilteredData] = useState(datos); // Inicializar con todos los datos
  const mapRef = useRef(null); // Referencia al MapContainer


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

  // Coordenadas geográficas del centro de Argentina
  const center = [-38.416097 - 3.5, -63.616672];

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
      "Buenos Aires",
      "Catamarca",
      "Ciudad Autónoma de Buenos Aires",
      "Córdoba",
      "Santa Cruz",
      "Santa Fe",
      "Chaco",
      "Chubut",
      "Corrientes",
      "Entre Ríos",
      "Formosa",
      "La Pampa",
      "La Rioja",
      "Mendoza",
      "Misiones",
      "Río Negro",
      "Salta",
      "San Juan",
      "San Luis",
      "Santa Cruz",
      "Santiago del Estero",
      "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
      "Tucumán"
    ];

    const dataItem = result.find(
      (item) =>
        provincesToHighlight.includes(feature.properties.nam) &&
      (feature.properties.nam === "Buenos Aires" &&
        item.distrito === "BUENOS AIRES") ||
      (feature.properties.nam === "Catamarca" &&
        item.distrito === "CATAMARCA") ||
      (feature.properties.nam === "Córdoba" && item.distrito === "CORDOBA") ||
      (feature.properties.nam === "Santa Fe" &&
        item.distrito === "SANTA FE") ||
      (feature.properties.nam === "Ciudad Autónoma de Buenos Aires" &&
        item.distrito === "CABA") ||
      (feature.properties.nam === "Santa Cruz" &&
        item.distrito === "SANTA CRUZ") ||
      (feature.properties.nam === "Chaco" && item.distrito === "CHACO") ||
      (feature.properties.nam === "Chubut" && item.distrito === "CHUBUT") ||
      (feature.properties.nam === "Corrientes" &&
        item.distrito === "CORRIENTES") ||
      (feature.properties.nam === "Entre Ríos" &&
        item.distrito === "ENTRE RIOS") ||
      (feature.properties.nam === "Formosa" &&
        item.distrito === "FORMOSA") ||
      (feature.properties.nam === "Jujuy" && item.distrito === "JUJUY") ||
      (feature.properties.nam === "La Pampa" &&
        item.distrito === "LA PAMPA") ||
      (feature.properties.nam === "La Rioja" &&
        item.distrito === "LA RIOJA") ||
      (feature.properties.nam === "Mendoza" && item.distrito === "MENDOZA") ||
      (feature.properties.nam === "Misiones" &&
        item.distrito === "MISIONES") ||
      (feature.properties.nam === "Río Negro" &&
        item.distrito === "RIO NEGRO") ||
      (feature.properties.nam === "Salta" && item.distrito === "SALTA") ||
      (feature.properties.nam === "San Juan" &&
        item.distrito === "SAN JUAN") ||
      (feature.properties.nam === "San Luis" &&
        item.distrito === "SAN LUIS") ||
      (feature.properties.nam === "Santa Cruz" &&
        item.distrito === "SANTA CRUZ") ||
      (feature.properties.nam === "Santiago del Estero" &&
        item.distrito === "SANTIAGO DEL ESTERO") ||
      (feature.properties.nam ===
        "Tierra del Fuego, Antártida e Islas del Atlántico Sur" &&
        item.distrito === "TIERRA DEL FUEGO") ||
      (feature.properties.nam === "Tucumán" && item.distrito === "TUCUMAN") ||
      (feature.properties.nam === "Neuquén" &&
      item.distrito === "NEUQUEN") ||
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
        (feature.properties.nam === "Buenos Aires" &&
          item.distrito === "BUENOS AIRES") ||
        (feature.properties.nam === "Catamarca" &&
          item.distrito === "CATAMARCA") ||
        (feature.properties.nam === "Córdoba" && item.distrito === "CORDOBA") ||
        (feature.properties.nam === "Santa Fe" &&
          item.distrito === "SANTA FE") ||
        (feature.properties.nam === "Ciudad Autónoma de Buenos Aires" &&
          item.distrito === "CABA") ||
        (feature.properties.nam === "Santa Cruz" &&
          item.distrito === "SANTA CRUZ") ||
        (feature.properties.nam === "Chaco" && item.distrito === "CHACO") ||
        (feature.properties.nam === "Chubut" && item.distrito === "CHUBUT") ||
        (feature.properties.nam === "Corrientes" &&
          item.distrito === "CORRIENTES") ||
        (feature.properties.nam === "Entre Ríos" &&
          item.distrito === "ENTRE RIOS") ||
        (feature.properties.nam === "Formosa" &&
          item.distrito === "FORMOSA") ||
        (feature.properties.nam === "Jujuy" && item.distrito === "JUJUY") ||
        (feature.properties.nam === "La Pampa" &&
          item.distrito === "LA PAMPA") ||
        (feature.properties.nam === "La Rioja" &&
          item.distrito === "LA RIOJA") ||
        (feature.properties.nam === "Mendoza" && item.distrito === "MENDOZA") ||
        (feature.properties.nam === "Misiones" &&
          item.distrito === "MISIONES") ||
        (feature.properties.nam === "Río Negro" &&
          item.distrito === "RIO NEGRO") ||
        (feature.properties.nam === "Salta" && item.distrito === "SALTA") ||
        (feature.properties.nam === "San Juan" &&
          item.distrito === "SAN JUAN") ||
        (feature.properties.nam === "San Luis" &&
          item.distrito === "SAN LUIS") ||
        (feature.properties.nam === "Santa Cruz" &&
          item.distrito === "SANTA CRUZ") ||
        (feature.properties.nam === "Santiago del Estero" &&
          item.distrito === "SANTIAGO DEL ESTERO") ||
        (feature.properties.nam ===
          "Tierra del Fuego, Antártida e Islas del Atlántico Sur" &&
          item.distrito === "TIERRA DEL FUEGO") ||
        (feature.properties.nam === "Tucumán" && item.distrito === "TUCUMAN") ||
        (feature.properties.nam === "Neuquén" &&
        item.distrito === "NEUQUEN") ||
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
        zoom={5}
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

export default MapaPais;
