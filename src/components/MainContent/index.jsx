import AsideCategories from "../../components/Aside";
import { useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox";
import useSearchBox from "../../../src/hooks/useSearchBox";
import ModalNewEquipment from "../../components/ModalNewEquipment"
import { ContainerEquipos, MainContainer, TitleCatalogo, SearchContainer, ButtonRegister } from "./styles";
//import getEquiposBiomedicos from "../../../data/getEquiposBiomedicos";
import { getEquiposData } from "../../data/getEquiposData";
import RenderAllEquipment from "../RenderAllEquipment/RenderAllEquipment";

const MainContent = ({ equiposBiomedicos }) => {
    const [equiposIniciales, setEquiposIniciales] = useState(equiposBiomedicos);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
    

    //CRAGA DATOS DESDE EL LOCALSTORAGE
    useEffect(() => {
        const datosGuardados = getEquiposData();
        console.log("TodosEquipos - datos guardados:", datosGuardados);
        setEquiposIniciales(datosGuardados);
    }, [])

    //SINCRONIZAR EL LOCALSTORAGE CON LOS CMABIOS QUE SE HAGAN
    useEffect(() => {
        localStorage.setItem("equiposBiomedicos", JSON.stringify(equiposIniciales));
    }, [equiposIniciales])


    useEffect(() => {
        if (categoriaSeleccionada === "Todos") return;
        const categoriasActuales = equiposIniciales.map(e => e.nivelRiesgo);
        if (!categoriasActuales.includes(categoriaSeleccionada)) {
            setCategoriaSeleccionada("Todos");
        }
    }, [equiposIniciales, categoriaSeleccionada]);


    //HOOK PERSONALIZADO QUE REALIZA LA FUNCION DE BUSQUEDA DE EQUIPOS POR NOMBRE O NIVEL DE RIESGO(CATEGORIA)
    const { busqueda, handleInputChange } = useSearchBox();
    //setEquiposIniciales([...equiposIniciales, nuevoEquipo]);

    //FILTRADO POR CATEGORIA
    const equiposFiltrados = categoriaSeleccionada === "Todos"
        ? equiposIniciales
        : equiposIniciales.filter(equipo => equipo.nivelRiesgo === categoriaSeleccionada);

    //FILTRADO POR BUSQUEDA
    const equiposBuscar = busqueda.toLowerCase();
    const equiposAMostrar = busqueda === ""
        ? equiposFiltrados
        : equiposFiltrados.filter(
            equipo =>
                (equipo.nombre?.toLowerCase() || '').includes(equiposBuscar) ||
                (equipo.nivelRiesgo?.toLowerCase() || '').includes(equiposBuscar)
        )
    return (
        <MainContainer >
            <AsideCategories listaEquipos={equiposIniciales} onCategoriaSeleccionada={setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada}/>
            <ContainerEquipos>
                <TitleCatalogo >CATALOGO DE TODOS LOS EQUIPOS</TitleCatalogo>

                {/*SECCION DE BUSCAR Y AGREGAR EQUIPOS */}
                <SearchContainer >
                    <SearchBox busqueda={busqueda} handleInputChange={handleInputChange} />
                    <ButtonRegister onClick={() => setMostrarModal(true)} >+ Agregar Equipo</ButtonRegister>
                </SearchContainer>

                {/*GRID DE EQUIPOS */}
                <RenderAllEquipment busqueda={busqueda} equiposAMostrar={equiposAMostrar} equiposIniciales={equiposIniciales} setEquiposIniciales={setEquiposIniciales} />

                {/*MODAL PARA EDITAR EQUIPOS*/}
                <ModalNewEquipment equiposIniciales={equiposIniciales} setEquiposIniciales={setEquiposIniciales} mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} />
            </ContainerEquipos>
        </MainContainer>

    )
}

export default MainContent;