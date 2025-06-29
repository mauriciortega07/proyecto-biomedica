/*import getEquiposBiomedicos from "./getEquiposBiomedicos";

function asignarIds(equipos) {
  return equipos.map((equipo, idx) => ({
    ...equipo,
    id: equipo.id || `${equipo.nombre}-${equipo.nivelRiesgo}-${idx}-${Date.now()}`
  }));
}

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
    const equiposConId = asignarIds(parsedData);
    localStorage.setItem("equiposBiomedicos", JSON.stringify(equiposConId));
    return equiposConId;
  } else {
    const equiposIniciales = asignarIds(getEquiposBiomedicos());
    console.log("getEquiposData - cargando datos base:", equiposIniciales);
    localStorage.setItem("equiposBiomedicos", JSON.stringify(equiposIniciales));
    return equiposIniciales;
  }
};*/
