import AsideCategories from "../../components/Aside";
import { useEffect, useState } from "react";
import SearchBox from "../../components/SearchBox";
import useSearchBox from "../../../src/hooks/useSearchBox";
import ModalNewEquipment from "../../components/ModalNewEquipment"
import { ContainerEquipos, MainContainer, TitleCatalogo, SearchContainer, ButtonRegister } from "./styles";
//import getEquiposBiomedicos from "../../../data/getEquiposBiomedicos";
import {getEquiposData} from "../../data/getEquiposData";
import RenderAllEquipment from "../RenderAllEquipment/RenderAllEquipment";

const MainContent = ({equiposBiomedicos}) => {

    const [equiposIniciales, setEquiposIniciales] = useState(equiposBiomedicos);
    const [mostrarModal, setMostrarModal] = useState(false);

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

    //HOOK PERSONALIZADO QUE REALIZA LA FUNCION DE BUSQUEDA DE EQUIPOS POR NOMBRE O NIVEL DE RIESGO(CATEGORIA)
    const { busqueda, handleInputChange } = useSearchBox();
    //setEquiposIniciales([...equiposIniciales, nuevoEquipo]);

    return (
        <MainContainer >
            <AsideCategories listaEquipos={equiposIniciales} />
            <ContainerEquipos>
                <TitleCatalogo >CATALOGO DE TODOS LOS EQUIPOS</TitleCatalogo>

                {/*SECCION DE BUSCAR Y AGREGAR EQUIPOS */}
                <SearchContainer >
                    <SearchBox busqueda={busqueda} handleInputChange={handleInputChange} />
                    <ButtonRegister onClick={() => setMostrarModal(true)} >+ Agregar Equipo</ButtonRegister>
                </SearchContainer>

                {/*GRID DE EQUIPOS */}
                <RenderAllEquipment busqueda={busqueda} equiposIniciales={equiposIniciales} setEquiposIniciales={setEquiposIniciales} />

                {/*MODAL PARA EDITAR EQUIPOS*/}
                <ModalNewEquipment equiposIniciales={equiposIniciales} setEquiposIniciales={setEquiposIniciales} mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} />
            </ContainerEquipos>
        </MainContainer>

    )
}

export default MainContent;