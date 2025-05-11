import getEquiposBiomedicos from "../../data/getEquiposBiomedicos";

const AsideCategories = ({ listaEquipos }) => {
    //SE OBTIENE LA LISTA DE EQUIPOS BIOMEDICOS ORIGINA Y SE REGRESA SOLO LA CATEGORIA DE RIESGO DE CADA UNO
    const categories = listaEquipos.map(listaEquipos => listaEquipos.nivelRiesgo);
    //console.log(categories);
    //SE CREA UNA NUEVA LISTA COPIANDO LAS CATEGORIAS UNICAS USANDO LA LISTA DE CATEGORIAS ORGINAL
    const uniqueCategories = [...new Set(categories)];
                

    return (
        <aside>
            <ul>
                 {
                    //SE MUESTRAN LAS CATEGORIAS UNICAS EN UNA LISTA
                    uniqueCategories.map(riesgo => <li key={riesgo}>{riesgo}</li> )
                 }
            </ul>

        </aside>
    )

}

export default AsideCategories;