import getEquiposBiomedicos from "./getEquiposBiomedicos";

export function getEquiposData() {
  const data = localStorage.getItem('equiposBiomedicos');
  console.log("getEquiposData - datos en localStorage:", data);

  if(data) {
    const parsedData = JSON.parse(data);
    console.log("getEquiposData - datos parseados:", parsedData);

    // Si el array está vacío, cargar el array base otra vez
    if(Array.isArray(parsedData) && parsedData.length === 0) {
      const equiposIniciales = getEquiposBiomedicos();
      localStorage.setItem("equiposBiomedicos", JSON.stringify(equiposIniciales));
      return equiposIniciales;
    }
    return parsedData;
  } else {
    const equiposIniciales = getEquiposBiomedicos();
    console.log("getEquiposData - cargando datos base:", equiposIniciales);
    localStorage.setItem("equiposBiomedicos", JSON.stringify(equiposIniciales));
    return equiposIniciales;
  }
};