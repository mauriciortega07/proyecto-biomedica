import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill } from 'lucide-react';
import {
    CardEquipos, GridEquipos,
    ContainerMsgNotFound, CardEquiposImgContainer,
    SectionInfoEquipos, ButtonEdit, ButtonDelete

} from './styles.js';
import ModalEditEquipment from '../ModalEditEquipment/index.jsx';
import { useState } from 'react';
import ModalDeleteEquipment from '../ModalDeleteEquipment/index.jsx';

const IconColor = {
    user: '#007BFF',       // azul
    text: '#6C757D',       // gris
    risk: '#DC3545',       // rojo
    checklist: '#17A2B8',  // celeste
    tool: '#28A745',       // verde
    wrench: '#FFC107',
    drill: '#ca7f05'    // amarillo
};



const RenderAllEquipment = ({ busqueda, equiposIniciales, setEquiposIniciales }) => {
    console.log(equiposIniciales)
    //ESTADOS DEL MODAL EDITAR EQUIPO
    const [modalEditEquipment, setModalEditEquipment] = useState(false);
    const [equipoAEditar, setEquipoAEditar] = useState(null);

    //ESTADOS DEL MODAL ELIMINAR EQUIPO
    const [modalDeleteEquipment, setModalDeleteEquipment] = useState(false);
    const[equipoAEliminar, setEquipoAEliminar] = useState(null);

    //FUNCION QUE FILTRA LOS EQUIPOS POR NOMBRE O NIVEL DE RIESGO
    const equiposBuscar = busqueda.toLowerCase();
    const equiposEncontrados = equiposIniciales.filter(
        equipo =>
            (equipo.nombre?.toLowerCase() || '').includes(equiposBuscar) || 
            (equipo.nivelRiesgo?.toLowerCase() || '').includes(equiposBuscar)
    );

    console.log(equiposEncontrados);

    const equiposAMostrar = busqueda === "" ? equiposIniciales : equiposEncontrados;

    if (busqueda !== "" && equiposEncontrados.length === 0) {
        return (
            <ContainerMsgNotFound>
                <label>No se encontraron resultados</label>
            </ContainerMsgNotFound>
        );
    }
    /* if (busqueda === "") return RenderResults(equiposIniciales);
     if (equiposEncontrados == false) return (
         <ContainerMsgNotFound>
             <label>No se encontraron resultados</label>
         </ContainerMsgNotFound>
     )
     return RenderResults(equiposEncontrados) */

    return (
        <>
            <GridEquipos>
                {
                    equiposAMostrar.map((equipo, i) => {
                        //const {nombre, descripcion, nivelRiesgo, nomAplicada, caracteristicas, mantPreventivo, mantCorrectivo} = equipo;

                        return (
                            <CardEquipos key={i}>
                                <CardEquiposImgContainer>
                                    <img style={{ width: "350px", height: "350px", objectFit: "cover" }} src={equipo.img} />
                                </CardEquiposImgContainer>
                                <article style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <SectionInfoEquipos className='infoEquipos'>
                                        <dd style={{ fontWeight: "bolder", fontSize: "clamp(1rem, 2vw, 2rem)", margin: "1rem 0rem" }}>{equipo.nombre}</dd>

                                        <dt><FileText size={18} color={IconColor.text} />Descripcion:</dt>
                                        <dd>{equipo.descripcion}</dd>

                                        <dt><AlertCircle size={18} color={IconColor.risk} />Nivel de Riesgo:</dt>
                                        <dd>{equipo.nivelRiesgo}</dd>



                                        <dt><ClipboardList size={18} color={IconColor.checklist} />NOM Aplicada:</dt>
                                        <dd>{equipo.nomAplicada}</dd>


                                        <dt><Wrench size={18} color={IconColor.wrench} />Caracteristicas: </dt>
                                        <dd>


                                            <ul>
                                                {equipo.caracteristicas.map((caracteristica, i) => <li key={i}>{caracteristica}</li>)}
                                            </ul>

                                        </dd>

                                        <dt><HardHat size={18} color={IconColor.tool} />Mantenimiento Preventivo: </dt>
                                        <dd>
                                            <ul>
                                                {equipo.mantPreventivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                                            </ul>
                                        </dd>


                                        <dt><Drill size={18} color={IconColor.drill} />Mantenimiento Correctivo: </dt>
                                        <dd>
                                            <ul>
                                                {equipo.mantCorrectivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                                            </ul>
                                        </dd>


                                        <section style={{ padding: "1rem" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <ButtonEdit onClick={() => {
                                                    setModalEditEquipment(true);
                                                    setEquipoAEditar(equipo);
                                                }}>Editar Equipo</ButtonEdit>
                                                <ButtonDelete onClick={() => {
                                                    setModalDeleteEquipment(true)
                                                    setEquipoAEliminar(equipo)  
                                                }}>Eliminar Equipo</ButtonDelete>
                                            </div>
                                        </section>
                                    </SectionInfoEquipos>
                                </article>
                            </CardEquipos>
                        )
                    })
                }

            </GridEquipos>

            {/*MODAL EDITAR EQUIPO (SE ABRE CON EL BOTON DE EDITAR) */}
            {
                modalEditEquipment && equipoAEditar && (
                    <ModalEditEquipment
                        equipoAEditar={equipoAEditar}
                        modalEditEquipment={modalEditEquipment}
                        setModalEditEquipment={setModalEditEquipment} 
                        setEquiposIniciales={setEquiposIniciales}
                        />
                        

                )
            }

            {/*MODAL ELIMINAR EQUIPO (SE ABRE CON EL BOTON DE ELIMINAR) */}
            {
                modalDeleteEquipment && equipoAEliminar && (
                    <ModalDeleteEquipment 
                        equipoAEliminar = {equipoAEliminar}
                        setModalDeleteEquipment={setModalDeleteEquipment}
                        equiposIniciales={equiposIniciales}
                        setEquiposIniciales={setEquiposIniciales}
                    />
                )
            }

        </>
    );

};



export default RenderAllEquipment;