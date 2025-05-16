import getEquiposBiomedicos from "../../data/getEquiposBiomedicos";
import { AsideContainer, UnorderListContainer } from "./styles";

const AsideCategories = ({ listaEquipos }) => {
    //SE OBTIENE LA LISTA DE EQUIPOS BIOMEDICOS ORIGINA Y SE REGRESA SOLO LA CATEGORIA DE RIESGO DE CADA UNO
    //const categories = listaEquipos.map(listaEquipos => listaEquipos.nivelRiesgo);
    //console.log(categories);
    //SE CREA UNA NUEVA LISTA COPIANDO LAS CATEGORIAS UNICAS USANDO LA LISTA DE CATEGORIAS ORGINAL
    //const uniqueCategories = [...new Set(categories)];


    return (
        <AsideContainer>
            <UnorderListContainer>
                {/*
                    //SE MUESTRAN LAS CATEGORIAS UNICAS EN UNA LISTA
                    uniqueCategories.map(riesgo => <li key={riesgo}><a href="#">{riesgo}</a></li> )
                 */}
                <li><a href="/Inicio">Todos los equipos</a></li>
                <li><a href="/Medio(Clase 2)">Medio(Clase 2)</a></li>
                <li><a href="/Alto(Clase 3)">Alto(Clase 3)</a></li>
                
            </UnorderListContainer>

        </AsideContainer>
    )

}

export default AsideCategories;