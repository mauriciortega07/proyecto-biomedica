import { useState, useEffect } from "react";

function limpiarEquipo(equipo) {
  const limpiarCampo = (campo) => {
    if(Array.isArray(campo)) return campo;
    if(typeof campo === "string") return campo.split('\n').map(linea => linea.trim()).filter(Boolean);
    return [];
  };

  return {
    ...equipo,
    caracteristicas: limpiarCampo(equipo.caracteristicas),
    mantPreventivo: limpiarCampo(equipo.mantPreventivo),
    mantCorrectivo: limpiarCampo(equipo.mantCorrectivo)
  };
}

const useEquiposBiomedicos= () => {
  const [equiposBiomedicos, setEquiposBiomedicos] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

    
    //const equiposBiomedicos = getEquiposData();
    //console.log(equiposBiomedicos);
  
    useEffect(() => {
      const fetchEquipos = async () => {
        try {
          const response = await fetch("http://localhost:4000/equipos_biomedicos");
          
          if(!response.ok) throw new Error("Error al obtener los datos de los equipos registrados");
          
          const data = await response.json();

          const equiposLimpios = data.map(e => ({
            
            ...e, 
            id: e.id || `${e.nombre}-${e.nivelRiesgo}-${Date.now()}`,
          })).map(limpiarEquipo)
  
          setEquiposBiomedicos(equiposLimpios);
          setCargando(false)
        
        } catch (error){
          console.error("Error al cargar los datos desde el servidor: ", error);
          setError(error.message);
          setCargando(false);
        }
      }
  
      fetchEquipos();
    }, []);

    return{equiposBiomedicos, setEquiposBiomedicos , cargando, error};
}

export default useEquiposBiomedicos;