//import getEquiposBiomedicos from "../../data/getEquiposBiomedicos1";
import { AsideContainer, UnorderListContainer, EnlaceCategories } from "./styles";

const AsideCategories = ({ listaEquipos = [], onCategoriaSeleccionada, categoriaSeleccionada }) => {
    //SE OBTIENE LA LISTA DE EQUIPOS BIOMEDICOS ORIGINA Y SE REGRESA SOLO LA CATEGORIA DE RIESGO DE CADA UNO
    const categories = listaEquipos.map(equipo => equipo.nivelRiesgo);
    
    //SE CREA UNA NUEVA LISTA COPIANDO LAS CATEGORIAS UNICAS USANDO LA LISTA DE CATEGORIAS ORGINAL
    const uniqueCategories = [...new Set(categories)];


    return (
        <AsideContainer>
            <UnorderListContainer>
               
                <li>
                    <EnlaceCategories onClick={() => onCategoriaSeleccionada("Todos")} className={categoriaSeleccionada === "Todos" ? "activo" : ""}>Todos los equipos</EnlaceCategories>
                </li>

                {uniqueCategories.length > 0 ? (
                    uniqueCategories.map(riesgo => (
                        <li key={riesgo}>
                            <EnlaceCategories onClick={() => onCategoriaSeleccionada(riesgo)} className={categoriaSeleccionada === riesgo ? "activo" : ""}>{riesgo}</EnlaceCategories>
                        </li>
                    ))
                ) : (
                    <li>
                        <span style={{ color: "#888" }}>Sin categorías</span>
                    </li>
                )}
                
            </UnorderListContainer>

        </AsideContainer>
    )

}

export default AsideCategories;