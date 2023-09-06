

const initialState = {
  cargo: "PRESIDENTE",
  distrito:"NACIONAL",
  distrito_mapa: "NACIONAL"
}



function rootReducer(state = initialState, action) {
    switch (action.type) {
      case "SELECT_DISTRITO":
          // console.log(action.payload)
        return {
          ...state,
          cargo: action.payload.cargo,
          distrito: action.payload.distrito,
        };
        case "SELECT_DIST_MAPA":
  
          return {
            ...state,
            distrito_mapa: action.payload
          };
      
      default:
        return state;
    }
  }



export default rootReducer;


