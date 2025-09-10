import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill, Cable, ImagePlus, CloudUploadIcon, MapPinned, FileDigit } from 'lucide-react';
import { useState } from "react";
import { ModalBackground, ModalContent, FormField, TextArea, TitleModal, ButtonSaveEquipment, TagsContainer } from "./styles";
const IconColor = {
    user: '#007BFF',       // azul
    text: '#6C757D',       // gris
    risk: '#DC3545',       // rojo
    checklist: '#17A2B8',  // celeste
    tool: '#28A745',       // verde
    wrench: '#FFC107', //gris
    drill: '#ca7f05', //sal
    cable: '#DC3545',//rojo
    imagePlus: '#EA40D0',
    cloudUploadIcon: '#EA40D0',
    mapPinned: '#17A2B8'
}

const ModalNewEquipment = ({ equiposIniciales, setEquiposIniciales, mostrarModal, setMostrarModal }) => {
    console.log(equiposIniciales)
    const [nuevoEquipo, setNuevoEquipo] = useState({
        nombre: "",
        descripcion: "",
        tipoDispositivo: "",
        activoEnInventario: "",
        ubicacion: "",
        numInventario: "",
        numSerieEquipo: "",
        nivelRiesgo: "",
        nomAplicada: "",
        caracteristicas: [],
        mantPreventivo: [],
        mantCorrectivo: [],
        img: ""
    })
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

    const parseList = (texto) => texto.split("\n").map((item) => item.trim()).filter(Boolean);


    const handleCambio = (e) => {
        const { name, value } = e.target;
        setNuevoEquipo({ ...nuevoEquipo, [name]: value })
    }

    const agregarEquipo = async (e) => {
        e.preventDefault();

        const userSession = JSON.parse(localStorage.getItem("user_session"));
        const nombreUsuarioEnSesion = userSession?.name || "Anonimo";
        const fechaActual = new Date().toLocaleString('es-MX', {
            day: '2-digit', month: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true,
        });
        const usuario_id = userSession?.id || null;

        const agregarEquipo = {
            nombre: nuevoEquipo.nombre,
            descripcion: nuevoEquipo.descripcion,
            tipoDispositivo: nuevoEquipo.tipoDispositivo,
            activoEnInventario: nuevoEquipo.activoEnInventario,
            ubicacion: nuevoEquipo.ubicacion || "sin ubicacion en el inventario",
            numInventario: nuevoEquipo.numInventario || "sin numero de inventario",
            numSerieEquipo: nuevoEquipo.numSerieEquipo || "sin numero de serie asignado",
            nivelRiesgo: nuevoEquipo.nivelRiesgo,
            nomAplicada: nuevoEquipo.nomAplicada,
            caracteristicas: parseList(nuevoEquipo.caracteristicas),
            mantCorrectivo: parseList(nuevoEquipo.mantCorrectivo),
            mantPreventivo: parseList(nuevoEquipo.mantPreventivo),
            img: nuevoEquipo.img,
            usuario_id: usuario_id,
            agregadoPor: nombreUsuarioEnSesion,
            fechaAgregado: fechaActual
        }

        try {
            const response = await fetch("https://54.226.35.178/equipos_biomedicos", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(agregarEquipo)
            });

            const data = await response.json();

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error("Error al registrar el equipo: " + errorText);
            }

            //agregamos el equipo a la lista local
            setEquiposIniciales(prev => [...prev, data.equipo])
            console.log(data)

            setMensajeConfirmacion("Equipo Agregado con Exito");

            setNuevoEquipo({
                nombre: "",
                descripcion: "",
                tipoDispositivo: "",
                activoEnInventario: "",
                ubicacion: "",
                numInventario: "",
                numSerieEquipo: "",
                nivelRiesgo: "",
                nomAplicada: "",
                caracteristicas: [],
                mantPreventivo: [],
                mantCorrectivo: [],
                img: ""

            });

        } catch (error) {
            console.error("Hubo un error al guardar el equipo en el servidor", error.message)
        }

        setTimeout(() => {
            setMostrarModal(false);
            setMensajeConfirmacion("");
        }, 3000);
    }

    if (!mostrarModal) return null;

    const renderUbication = () => {
        if (nuevoEquipo.activoEnInventario === 'si') {
            return (
                <>
                    <TagsContainer><MapPinned size={20} color={IconColor.text} style={{ margin: "10px 10px" }} />Ubicacion: </TagsContainer>
                    <FormField
                        name="ubicacion"
                        placeholder="define su ubicacion"
                        value={nuevoEquipo.ubicacion}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><FileDigit size={20} color={IconColor.text} style={{ margin: "10px 10px" }} />N° de inventario: </TagsContainer>
                    <FormField
                        name="numInventario"
                        placeholder="define su numero de inventario"
                        value={nuevoEquipo.numInventario}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><FileDigit size={20} color={IconColor.text} style={{ margin: "10px 10px" }} />N° de Serie del Equipo: </TagsContainer>
                    <FormField
                        name="numSerieEquipo"
                        placeholder="define su numero de serie"
                        value={nuevoEquipo.numSerieEquipo}
                        onChange={handleCambio}
                        required
                    />
                </>
            )
        }

    }

    return (
        <ModalBackground onClick={() => setMostrarModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <TitleModal>Agregar Nuevo Equipo</TitleModal>
                <form onSubmit={agregarEquipo}>
                    <dt><Cable size={20} color={IconColor.cable} style={{ margin: "0px 10px" }} />Nombre del equipo</dt>
                    <FormField
                        name="nombre"
                        placeholder="nombre del equipo"
                        value={nuevoEquipo.nombre}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Descripcion:</TagsContainer>
                    <TextArea
                        name="descripcion"
                        placeholder="Descripcion del equipo"
                        value={nuevoEquipo.descripcion}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Tipo de Dispositivo:</TagsContainer>
                    <TextArea
                        name="tipoDispositivo"
                        placeholder="tipo de dispositivo"
                        value={nuevoEquipo.tipoDispositivo}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><CloudUploadIcon size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />¿Esta activo en el inventario?:</TagsContainer>
                    <div size={20} color={IconColor.text} style={{ margin: "20px 10px" }}>
                        <label size={20} color={IconColor.text}>
                            <input
                                type='radio'
                                name="activoEnInventario"
                                value='si'
                                checked={nuevoEquipo.activoEnInventario === 'si'}
                                onChange={handleCambio}
                                required
                            />
                            Si
                        </label>
                        <label size={20} color={IconColor.text}>
                            <input
                                type='radio'
                                name="activoEnInventario"
                                value='no'
                                checked={nuevoEquipo.activoEnInventario === 'no'}
                                onChange={handleCambio}
                                required
                            />
                            No
                        </label>
                        {renderUbication()}
                    </div>



                    <TagsContainer><AlertCircle size={20} color={IconColor.risk} style={{ margin: "0px 10px" }} />Nivel de Riesgo:</TagsContainer>
                    <FormField
                        name="nivelRiesgo"
                        placeholder="Nivel de riesgo"
                        value={nuevoEquipo.nivelRiesgo}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><ClipboardList size={20} color={IconColor.checklist} style={{ margin: "0px 10px" }} />NOM Aplicada:</TagsContainer>
                    <TextArea
                        name="nomAplicada"
                        placeholder="Norma de Mantenmiento aplicada"
                        value={nuevoEquipo.nomAplicada}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><Wrench size={20} color={IconColor.wrench} style={{ margin: "0px 10px" }} />Caracteristicas: </TagsContainer>
                    <TextArea
                        name="caracteristicas"
                        placeholder="Caracteristicas (una por linea)"
                        value={nuevoEquipo.caracteristicas}
                        onChange={handleCambio}
                        required
                    />

                    <TagsContainer><Drill size={20} color={IconColor.drill} style={{ margin: "0px 10px" }} />Mantenimiento Correctivo: </TagsContainer>
                    <TextArea
                        name="mantCorrectivo"
                        placeholder="Ingresa el Mantenimineto Correctivo (una por linea)"
                        value={nuevoEquipo.mantCorrectivo}
                        onChange={handleCambio}
                        required
                    />


                    <TagsContainer><HardHat size={20} color={IconColor.tool} style={{ margin: "0px 10px" }} />Mantenimiento Preventivo: </TagsContainer>
                    <TextArea
                        name="mantPreventivo"
                        placeholder="Ingresa el Mantenimineto Preventivo (una por linea)"
                        value={nuevoEquipo.mantPreventivo}
                        onChange={handleCambio}
                        required
                    />


                    <TagsContainer><ImagePlus size={20} color={IconColor.imagePlus} style={{ margin: "0px 10px" }} />Imagen del Equipo: </TagsContainer>
                    <FormField
                        name="img"
                        placeholder="https://..."
                        value={nuevoEquipo.img}
                        onChange={handleCambio}
                        required

                    />
                    {mensajeConfirmacion && <p style={{ color: "green", marginBottom: "1rem ", textAlign: "center", fontWeight: "bolder" }}>Equipo Agregado con Exito</p>}
                    <div>
                        <ButtonSaveEquipment type="submit">Guardar Equipo</ButtonSaveEquipment>
                    </div>
                </form>
            </ModalContent>
        </ModalBackground>
    )

}

export default ModalNewEquipment;