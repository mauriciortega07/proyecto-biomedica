import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill, Cable, ImagePlus } from 'lucide-react';
import { useState } from "react";
import {ModalBackground, ModalContent, FormField, TextArea, TitleModal, ButtonSaveEquipment} from "./styles";
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

const ModalNewEquipment = ( {equiposIniciales = [], setEquiposIniciales, mostrarModal, setMostrarModal} = {}) => {
    console.log(equiposIniciales)
    const [nuevoEquipo, setNuevoEquipo] = useState({
        nombre: "",
        descripcion: "",
        nivelRiesgo: "",
        nomAplicada: "",
        caracteristicas: [],
        mantPreventivo: [],
        mantCorrectivo: [],
        img:""
    })
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

    const parseList = (texto) => texto.split("\n").map((item) => item.trim()).filter(Boolean);
    

    const handleCambio = (e) => {
        const { name, value } = e.target;
        setNuevoEquipo({ ...nuevoEquipo, [name]: value })
    }


    const agregarEquipo = (e) => {
        e.preventDefault();

        const userSession = JSON.parse(localStorage.getItem("user_session"));
        const nombreUsuarioEnSesion = userSession?.name || "Anonimo";

        const nuevo = {
            ...nuevoEquipo,
            id: `${nuevoEquipo.nombre}-${nuevoEquipo.nivelRiesgo}-${Date.now()}`,
            caracteristicas: parseList(nuevoEquipo.caracteristicas),
            mantPreventivo: parseList(nuevoEquipo.mantPreventivo),
            mantCorrectivo: parseList(nuevoEquipo.mantCorrectivo),
            agregadoPor: nombreUsuarioEnSesion,
            fechaAgregado: new Date().toLocaleString()
        };

        setEquiposIniciales(prev => [...prev, nuevo]);
        setMensajeConfirmacion("Equipo Agregado con Exito");

        setNuevoEquipo({
            nombre: "",
            descripcion: "",
            nivelRiesgo: "",
            nomAplicada: "",
            caracteristicas: [],
            mantPreventivo: [],
            mantCorrectivo: [],
            img:""

        });
        setTimeout(() => {
            setMostrarModal(false);
            setMensajeConfirmacion("");
        }, 3000)
        
    }

if(!mostrarModal) return null;

return (
        <ModalBackground onClick={() => setMostrarModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <TitleModal>Agregar Nuevo Equipo</TitleModal>
                <form onSubmit={agregarEquipo}>
                   <dt><Cable size={20} color={IconColor.cable} style={{margin:"0px 10px"}}/>Nombre del equipo</dt> 
                    <FormField
                        name="nombre"
                        placeholder="nombre del equipo"
                        value={nuevoEquipo.nombre}
                        onChange={handleCambio}
                        required
                    />

                    <dt><FileText size={20} color={IconColor.text} style={{margin:"0px 10px"}}/>Descripcion:</dt>
                    <TextArea
                        name="descripcion"
                        placeholder="Descripcion del equipo"
                        value={nuevoEquipo.descripcion}
                        onChange={handleCambio}
                        required
                    />

                    <dt><AlertCircle size={20} color={IconColor.risk} style={{margin:"0px 10px"}}/>Nivel de Riesgo:</dt>                
                    <FormField
                        name="nivelRiesgo"
                        placeholder="Nivel de riesgo"
                        value={nuevoEquipo.nivelRiesgo}
                        onChange={handleCambio}
                        required
                    />

                    <dt><ClipboardList size={20} color={IconColor.checklist} style={{margin:"0px 10px"}}/>NOM Aplicada:</dt>
                    <TextArea
                        name="nomAplicada"
                        placeholder="Norma de Mantenmiento aplicada"
                        value={nuevoEquipo.nomAplicada}
                        onChange={handleCambio}
                        required
                    />

                    <dt><Wrench size={20} color={IconColor.wrench} style={{margin:"0px 10px"}} />Caracteristicas: </dt>
                    <TextArea
                        name="caracteristicas"
                        placeholder="Caracteristicas (una por linea)"
                        value={nuevoEquipo.caracteristicas}
                        onChange={handleCambio}
                        required
                    />

                    <dt><HardHat size={20} color={IconColor.tool} style={{margin:"0px 10px"}}/>Mantenimiento Preventivo: </dt>
                    <TextArea
                        name="mantCorrectivo"
                        placeholder="Ingresa el Mantenimineto Preventivo (una por linea)"
                        value={nuevoEquipo.mantCorrectivo}
                        onChange={handleCambio}
                        required
                    />

                    <dt><Drill size={20} color={IconColor.drill} style={{margin:"0px 10px"}}/>Mantenimiento Correctivo: </dt>
                    <TextArea
                        name="mantPreventivo"
                        placeholder="Ingresa el Mantenimineto Correctivo (una por linea)"
                        value={nuevoEquipo.mantPreventivo}
                        onChange={handleCambio}
                        required
                    />
                    
                    <dt><ImagePlus size={20} color={IconColor.imagePlus} style={{margin:"0px 10px"}}/>Imagen del Equipo: </dt>
                    <FormField 
                        name="img"
                        placeholder="https://..."
                        value={nuevoEquipo.img}
                        onChange={handleCambio}
                        required
                    
                    />
                    {mensajeConfirmacion && <p style={{color:"green", marginBottom:"1rem ", textAlign:"center", fontWeight:"bolder"}}>Equipo Agregado con Exito</p>}
                    <div>
                        <ButtonSaveEquipment type="submit">Guardar Equipo</ButtonSaveEquipment>
                    </div>
                </form>
            </ModalContent>
        </ModalBackground>
    ) 

}

export default ModalNewEquipment;