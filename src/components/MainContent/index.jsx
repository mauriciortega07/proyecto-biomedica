import AsideCategories from "../../components/Aside";
import { useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox";
import useSearchBox from "../../../src/hooks/useSearchBox";
import ModalNewEquipment from "../../components/ModalNewEquipment"
import { ContainerEquipos, MainContainer, TitleCatalogo, SearchContainer, ButtonRegister } from "./styles";
//import getEquiposBiomedicos from "../../../data/getEquiposBiomedicos";
//import { getEquiposData } from "../../data/getEquiposData";
import RenderAllEquipment from "../RenderAllEquipment/RenderAllEquipment";
import ModalFilterEquipment from "../ModalFilterEquipment";
import useEquiposBiomedicos from "../../data/useEquiposBiomedicos"

const MainContent = ({ equiposBiomedicos, setEquiposBiomedicos }) => {
    //const [equiposIniciales, setEquiposIniciales] = useState(equiposBiomedicos);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalEquiposPorFiltro, setMostrarModalEquiposPorFiltro] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");



    //CRAGA DATOS DESDE EL LOCALSTORAGE
    
    function parseMultilineString(text) {
        if (typeof text !== "string") return [];
        return text
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean);
    }

    // Normalizar datos para convertir strings multilinea en arrays
    const equiposNormalizados = equiposBiomedicos.map(equipo => ({
        ...equipo,
        caracteristicas: parseMultilineString(equipo.caracteristicas),
        mantPreventivo: parseMultilineString(equipo.mantPreventivo),
        mantCorrectivo: parseMultilineString(equipo.mantCorrectivo),
    }));


    //SINCRONIZA LAS CATEGORIAS CUANDO SE ELIMINAN O SE GAREGA UNA NUEVA
    useEffect(() => {
        if (categoriaSeleccionada === "Todos") return;
        const categoriasActuales = equiposBiomedicos.map(e => e.nivelRiesgo);
        if (!categoriasActuales.includes(categoriaSeleccionada)) {
            setCategoriaSeleccionada("Todos");
        }
    }, [equiposBiomedicos, categoriaSeleccionada]);


    //HOOK PERSONALIZADO QUE REALIZA LA FUNCION DE BUSQUEDA DE EQUIPOS POR NOMBRE O NIVEL DE RIESGO(CATEGORIA)
    const { busqueda, handleInputChange } = useSearchBox();
    //setEquiposIniciales([...equiposIniciales, nuevoEquipo]);

    //FILTRADO POR CATEGORIA
    const equiposFiltrados = categoriaSeleccionada === "Todos"
        ? equiposBiomedicos
        : equiposBiomedicos.filter(equipo => equipo.nivelRiesgo === categoriaSeleccionada);

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
            <AsideCategories listaEquipos={equiposBiomedicos} onCategoriaSeleccionada={setCategoriaSeleccionada} categoriaSeleccionada={categoriaSeleccionada} />
            <ContainerEquipos>
                <TitleCatalogo >CATALOGO DE TODOS LOS EQUIPOS</TitleCatalogo>

                {/*SECCION DE BUSCAR Y AGREGAR EQUIPOS */}
                <SearchContainer >
                    <SearchBox busqueda={busqueda} handleInputChange={handleInputChange} />
                    <ButtonRegister onClick={() => setMostrarModal(true)} >+ Agregar Equipo</ButtonRegister>
                    <ButtonRegister onClick={() => setMostrarModalEquiposPorFiltro(true)} >Agregar Equipo Mediante Toma de Decision</ButtonRegister>
                </SearchContainer>

                {/*GRID DE EQUIPOS */}
                <RenderAllEquipment busqueda={busqueda} equiposAMostrar={equiposAMostrar} equiposIniciales={equiposNormalizados} setEquiposIniciales={setEquiposBiomedicos} />

                {/*MODAL PARA EDITAR EQUIPOS*/}
                <ModalNewEquipment equiposIniciales={equiposNormalizados} setEquiposIniciales={setEquiposBiomedicos} mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} />

                {/*MODAL PARA AGREGAR EQUIPOS MEDIANTE TOMA DE DECISIONES*/}
                <ModalFilterEquipment mostrarModalEquiposPorFiltro={mostrarModalEquiposPorFiltro} setMostrarModalEquiposPorFiltro={setMostrarModalEquiposPorFiltro} setEquiposIniciales={setEquiposBiomedicos} />
            </ContainerEquipos>
        </MainContainer>

    )
}

export default MainContent;