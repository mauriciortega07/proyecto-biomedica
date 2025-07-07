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



const RenderAllEquipment = ({ busqueda, equiposAMostrar = [], equiposIniciales, setEquiposIniciales, cargando, error }) => {
    console.log(equiposIniciales)
    //ESTADOS DEL MODAL EDITAR EQUIPO
    const [modalEditEquipment, setModalEditEquipment] = useState(false);
    const [equipoAEditar, setEquipoAEditar] = useState(null);

    //ESTADOS DEL MODAL ELIMINAR EQUIPO
    const [modalDeleteEquipment, setModalDeleteEquipment] = useState(false);
    const [equipoAEliminar, setEquipoAEliminar] = useState(null);

    //FUNCION QUE FILTRA LOS EQUIPOS POR NOMBRE O NIVEL DE RIESGO

    if (cargando) return <p>Cargando Equipos...</p>
    if (error) {
        return (
            <p style={{ color: 'red' }}>Error al cargar los equipos...{error}</p>
        );
    }

    if (equiposAMostrar.length === 0) {
        const mensaje = busqueda === "" ? "No hay equipos registrados." : "No se encontraron resultados para la busqueda.";



        return (
            <ContainerMsgNotFound>
                <label>{mensaje}</label>
            </ContainerMsgNotFound>
        );
    }

    return (
        <>
            <GridEquipos>
                {
                    equiposAMostrar.map((equipo, i) => {

                        return (
                            <CardEquipos key={equipo.id || i}>
                                <CardEquiposImgContainer>
                                    <img style={{ width: "350px", height: "350px", objectFit: "cover" }} src={equipo.img} />
                                </CardEquiposImgContainer>
                                <article style={{ display: "flex", justifyContent: "space-evenly" }}>
                                    <SectionInfoEquipos className='infoEquipos'>
                                        <dd style={{ fontWeight: "bolder", fontSize: "clamp(1rem, 2vw, 2rem)", margin: "1rem 0rem" }}>{equipo.nombre}</dd>

                                        <dt><FileText size={18} color={IconColor.text} />Descripcion:</dt>
                                        <dd>{equipo.descripcion}</dd>

                                        <dt><FileText size={18} color={IconColor.text} />Tipo de Dispositivo:</dt>
                                        <dd>{equipo.tipoDispositivo}</dd>

                                        <dt><FileText size={18} color={IconColor.text} />Activo en el inventario:</dt>
                                        <dd>{equipo.activoEnInventario}</dd>

                                        <dt><FileText size={18} color={IconColor.text} />Ubicacion:</dt>
                                        <dd>{equipo.ubicacion}</dd>

                                        <dt><AlertCircle size={18} color={IconColor.risk} />Nivel de Riesgo:</dt>
                                        <dd>{equipo.nivelRiesgo}</dd>

                                        <dt><ClipboardList size={18} color={IconColor.checklist} />NOM Aplicada:</dt>
                                        <dd>{equipo.nomAplicada}</dd>


                                        <dt><Wrench size={18} color={IconColor.wrench} />Caracteristicas: </dt>
                                        <dd>
                                            <ul>
                                                {/*equipo.caracteristicas.map((caracteristica, i) => <li key={i}>{caracteristica}</li>)*/}
                                                {(Array.isArray(equipo.caracteristicas) ? equipo.caracteristicas : []).map((caracteristica, i) => (
                                                    <li key={i}>{caracteristica}</li>
                                                ))}
                                            </ul>

                                        </dd>

                                        <dt><HardHat size={18} color={IconColor.tool} />Mantenimiento Preventivo: </dt>
                                        <dd>
                                            <ul>
                                                {/*equipo.mantPreventivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)*/}
                                                {(Array.isArray(equipo.mantPreventivo) ? equipo.mantPreventivo : []).map((mantenimiento, i) => (
                                                    <li key={i}>{mantenimiento}</li>
                                                ))}
                                            </ul>
                                        </dd>


                                        <dt><Drill size={18} color={IconColor.drill} />Mantenimiento Correctivo: </dt>
                                        <dd>
                                            <ul>
                                                {/*equipo.mantCorrectivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)*/}
                                                {(Array.isArray(equipo.mantCorrectivo) ? equipo.mantCorrectivo : []).map((mantenimiento, i) => (
                                                    <li key={i}>{mantenimiento}</li>
                                                ))}
                                            </ul>
                                        </dd>

                                        {equipo.usuario_id && (
                                            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                                                Editado por: <strong>{equipo.usuario_id}</strong>
                                            </p>
                                        )}

                                        {equipo.fechaModificacion && (
                                            <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#666" }}>
                                                Última edición: {equipo.fechaModificacion}
                                            </p>
                                        )}

                                        {equipo.usuario_id && (
                                            <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                                                Agregado por: {equipo.usuario_id}
                                            </p>
                                        )}

                                        {equipo.fechaAgregado && (
                                            <p style={{ fontStyle: "italic", fontSize: "0.8rem", color: "#666" }}>
                                                Agregado el: {equipo.usuario_id}
                                            </p>
                                        )}



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
                        equipoAEliminar={equipoAEliminar}
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