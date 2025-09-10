import { useEffect, useState } from "react";
import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill, Cable, ImagePlus } from 'lucide-react';
import { ModalBackground, ModalContent, FormField, TextArea, TitleModal, ButtonSaveEquipment, ButtonCancelled, ButtonsContainer, TagsContainer } from "./styles";

const IconColor = {
    user: '#007BFF',       // azul
    text: '#6C757D',       // gris
    risk: '#DC3545',       // rojo
    checklist: '#17A2B8',  // celeste
    tool: '#28A745',       // verde
    wrench: '#FFC107', //gris
    drill: '#ca7f05', //sal
    cable: '#DC3545',//rojo
    imagePlus: '#EA40D0'
}

const API_URL = "/api";

const ModalEditEquipment = ({ equipoAEditar, modalEditEquipment, setModalEditEquipment, setEquiposIniciales }) => {

    const [equipoEditado, setEquipoEditado] = useState({
        nombre: "",
        descripcion: "",
        tipoDispositivo: "",
        activoEnInventario: "",
        ubicacion: "Sin Ubicación En El Inventario",
        nivelRiesgo: "",
        nomAplicada: "",
        caracteristicas: [],
        mantPreventivo: [],
        mantCorrectivo: [],
        img: ""
    })

    //ESTADO DE MENSAJE DE CONFIRMACION
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

    //ESTADO PARA ERRORES DE FETCH
    const [errorFetch, setErrorFetch] = useState("");


    //CARGA LOS DATOS DEL EQUIPO EN CUESTION
    useEffect(() => {
        if (equipoAEditar) {
            setEquipoEditado({
                ...equipoAEditar,
                caracteristicas: Array.isArray(equipoAEditar.caracteristicas)
                    ? equipoAEditar.caracteristicas.join("\n")
                    : equipoAEditar.caracteristicas || "",
                mantPreventivo: Array.isArray(equipoAEditar.mantPreventivo)
                    ? equipoAEditar.mantPreventivo.join("\n")
                    : equipoAEditar.mantPreventivo || "",
                mantCorrectivo: Array.isArray(equipoAEditar.mantCorrectivo)
                    ? equipoAEditar.mantCorrectivo.join("\n")
                    : equipoAEditar.mantCorrectivo || "",
                img: equipoAEditar.img || ""
            });
        }

    }, [equipoAEditar]);

    //MANEJA EL CAMBIO DE LOS INPUTS
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEquipoEditado(prev => ({ ...prev, [name]: value }));

    };

    //FUNCION ASINCRONA PARA GUARDAR LOS CAMBIOS EN LA BD
    const handleSave = async () => {
        setMensajeConfirmacion("");
        setErrorFetch("");

        const userSession = JSON.parse(localStorage.getItem("user_session"));
        const nombreUsuarioEnSesion = userSession?.name || "Anonimo";
        const fechaModificacion = new Date().toLocaleString('es-MX', {
            day: '2-digit', month: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true,
        });

        const updateEquipo = {
            ...equipoEditado,
            caracteristicas: equipoEditado.caracteristicas.split('\n').filter(Boolean),
            mantPreventivo: equipoEditado.mantPreventivo.split('\n').filter(Boolean),
            mantCorrectivo: equipoEditado.mantCorrectivo.split('\n').filter(Boolean),
            editadoPor: nombreUsuarioEnSesion,
            fechaModificacion: fechaModificacion
        };

        try {
            // Petición PUT al backend para actualizar el equipo en la base de datos
            const response = await fetch(`/api/equipos_biomedicos/${equipoAEditar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateEquipo),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar equipo en la base de datos");
            }

            const data = await response.json();

            // Actualizar la lista local con la info recibida del servidor
            setEquiposIniciales(prevEquipos => prevEquipos.map(equipo =>
                equipo.id === equipoAEditar.id ? data.equipo : equipo
            ));

            setMensajeConfirmacion("Equipo Editado con Éxito");

            setTimeout(() => {
                setModalEditEquipment(false);
                setMensajeConfirmacion("");
            }, 3000);

        } catch (error) {
            console.error("Error en handleSave:", error);
            setErrorFetch("Hubo un error al actualizar el equipo. Intenta nuevamente.");
        }
    };


    const handleClose = () => setModalEditEquipment(false);




    if (!modalEditEquipment) return null;

    return (

        <ModalBackground>
            <ModalContent>
                <TitleModal>Equipo a Editar</TitleModal>

                <TagsContainer><Cable size={20} color={IconColor.cable} style={{ margin: "0px 10px" }} />Nombre del equipo</TagsContainer>
                <FormField
                    name="nombre"
                    placeholder="Nombre del equipo"
                    value={equipoEditado.nombre}
                    onChange={handleInputChange}
                />

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Descripcion:</TagsContainer>
                <TextArea
                    name="descripcion"
                    placeholder="Descripcion del equipo"
                    value={equipoEditado.descripcion}
                    onChange={handleInputChange}
                />

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />¿Esta activo en el inventario?:</TagsContainer>
                <div size={20} color={IconColor.text} style={{ margin: "20px 10px" }} >
                    <label size={20} color={IconColor.text}>
                        <input
                            type='radio'
                            name="activoEnInventario"
                            value='si'
                            checked={equipoEditado.activoEnInventario === 'si'}
                            onChange={handleInputChange}
                            required
                        />
                        Si
                    </label>
                    <label size={20} color={IconColor.text}>
                        <input
                            type='radio'
                            name="activoEnInventario"
                            value='no'
                            checked={equipoEditado.activoEnInventario === 'no'}
                            onChange={handleInputChange}
                            required
                        />
                        No
                    </label>
                </div>

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Ubicacion: </TagsContainer>
                <FormField
                    name="ubicacion"
                    placeholder="define su ubicacion"
                    value={equipoEditado.ubicacion}
                    onChange={handleInputChange}
                    required
                />

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />N° de Inventario: </TagsContainer>
                <FormField
                    name="numInventario"
                    placeholder="define su numero en el inventario"
                    value={equipoEditado.numInventario}
                    onChange={handleInputChange}
                    required
                />

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />N° de Serie del Equipo: </TagsContainer>
                <FormField
                    name="numSerieEquipo"
                    placeholder="define el numero de serie del equipo"
                    value={equipoEditado.numSerieEquipo}
                    onChange={handleInputChange}
                    required
                />

                <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Tipo de Dispositivo:</TagsContainer>
                <TextArea
                    name="tipoDispositivo"
                    placeholder="Tipo de Dispositivo"
                    value={equipoEditado.tipoDispositivo}
                    onChange={handleInputChange}
                />

                <TagsContainer><AlertCircle size={20} color={IconColor.risk} style={{ margin: "0px 10px" }} />Nivel de Riesgo:</TagsContainer>
                <FormField
                    name="nivelRiesgo"
                    placeholder="Nivel de riesgo"
                    value={equipoEditado.nivelRiesgo}
                    onChange={handleInputChange}
                />

                <TagsContainer><ClipboardList size={20} color={IconColor.checklist} style={{ margin: "0px 10px" }} />NOM Aplicada:</TagsContainer>
                <FormField
                    name="nomAplicada"
                    placeholder="Norma de Mantenmiento aplicada"
                    value={equipoEditado.nomAplicada}
                    onChange={handleInputChange}
                />

                <TagsContainer><Wrench size={20} color={IconColor.wrench} style={{ margin: "0px 10px" }} />Caracteristicas: (Una por linea)</TagsContainer>
                <TextArea
                    name="caracteristicas"
                    placeholder="Caracteristicas (una por linea)"
                    value={equipoEditado.caracteristicas}
                    onChange={handleInputChange}
                />

                <TagsContainer><HardHat size={20} color={IconColor.tool} style={{ margin: "0px 10px" }} />Mantenimiento Preventivo: (Una Accion por linea)</TagsContainer>
                <TextArea
                    name="mantPreventivo"
                    value={equipoEditado.mantPreventivo}
                    placeholder="Ingresa el Mantenimineto Preventivo (una por linea)"
                    onChange={handleInputChange}
                />

                <TagsContainer><Drill size={20} color={IconColor.drill} style={{ margin: "0px 10px" }} />Mantenimiento Correctivo: (Una Accion por linea)</TagsContainer>
                <TextArea
                    name="mantCorrectivo"
                    placeholder="Ingresa el Mantenimineto Corectivo (una por linea)"
                    value={equipoEditado.mantCorrectivo}
                    onChange={handleInputChange}
                />

                <TagsContainer><ImagePlus size={20} color={IconColor.imagePlus} style={{ margin: "0px 10px" }} />Imagen del Equipo: </TagsContainer>
                <FormField
                    name="img"
                    placeholder="link de la imagen del dispositivo"
                    value={equipoEditado.img}
                    onChange={handleInputChange}

                />
                {equipoEditado.img && (

                    <img
                        src={equipoEditado.img}
                        alt="muestra_de_la_imagen_del_equipo"
                        style={{ width: "100%", maxHeight: '100%', objectFit: "cover", marginBottom: '1rem' }}
                    />
                )}

                {mensajeConfirmacion && <p style={{ color: "green", marginBottom: "1rem ", textAlign: "center", fontWeight: "bolder" }}>{mensajeConfirmacion}</p>}
                {errorFetch && <p style={{ color: "red", marginBottom: "1rem", textAlign: "center", fontWeight: "bolder" }}>{errorFetch}</p>}
                <ButtonsContainer></ButtonsContainer>
                <ButtonsContainer>
                    <ButtonCancelled onClick={handleClose}>Cancelar</ButtonCancelled>
                    <ButtonSaveEquipment onClick={handleSave}>Guardar Cambios</ButtonSaveEquipment>
                </ButtonsContainer>

            </ModalContent>
        </ModalBackground>
    )



}

export default ModalEditEquipment;