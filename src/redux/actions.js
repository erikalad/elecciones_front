import axios from "axios";

export const selectDistrito = (cargo, distrito) => {
    return {
      type: 'SELECT_DISTRITO',
      payload: { cargo, distrito }
    };
  };

export const selectDistritoMapa = (distrito) => {
    return {
      type: 'SELECT_DIST_MAPA',
      payload: distrito
    };
  };