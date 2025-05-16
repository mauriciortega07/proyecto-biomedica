import { useEffect, useState } from "react";
import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill, Cable, ImagePlus } from 'lucide-react';
import {ModalBackground, ModalContent, FormField, TextArea, TitleModal, ButtonSaveEquipment, ButtonCancelled, ButtonsContainer} from "./styles";

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

const ModalEditEquipment = ({equipoAEditar, modalEditEquipment, setModalEditEquipment, setEquiposIniciales}) => {

    const [equipoEditado, setEquipoEditado] = useState({
        nombre:'',
        descripcion: '',
        nivelRiesgo: '',
        nomAplicada: '',
        caracteristicas: [],
        mantPreventivo: [],
        mantCorrectivo: [],
        img:""
    })

    //ESTADO DE MENSAJE DE CONFIRMACION
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
    

    //CARGA LOS DATOS DEL EQUIPO EN CUESTION
    useEffect(() => {
        if(equipoAEditar) {
            setEquipoEditado({
                ...equipoAEditar,
                caracteristicas: equipoAEditar.caracteristicas.join("\n"),
                mantPreventivo: equipoAEditar.mantPreventivo.join('\n'),
                mantCorrectivo: equipoAEditar.mantCorrectivo.join('\n'),
                img: equipoAEditar.img || ""
            });
        }

    }, [equipoAEditar]);

    //MANEJA EL CAMBIO DE LOS INPUTS
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEquipoEditado(prev => ({...prev, [name] : value}));
    
    };
    

    const handleSave = () => {
        setMensajeConfirmacion("Equipo Editado con Exito");
        const updateEquipo =  {
                ...equipoEditado,
                caracteristicas: equipoEditado.caracteristicas.split('\n').filter(Boolean),
                mantPreventivo: equipoEditado.mantPreventivo.split('\n').filter(Boolean),
                mantCorrectivo: equipoEditado.mantCorrectivo.split('\n').filter(Boolean)
        };

        setEquiposIniciales(
            prevEquipos => prevEquipos.map(equipo => 
                equipo.nombre == equipoAEditar.nombre ? updateEquipo : equipo
            )
        
        );

        setTimeout(() => {
            setModalEditEquipment(false);
            setMensajeConfirmacion("");
        }, 3000)
    };

    const handleClose = () => setModalEditEquipment(false);

    


    if(!modalEditEquipment) return null;

    return( 

        <ModalBackground>
            <ModalContent>
                <TitleModal>Equipo a Editar</TitleModal>
                
                <dt><Cable size={20} color={IconColor.cable} style={{margin:"0px 10px"}}/>Nombre del equipo</dt> 
                <FormField 
                    name="nombre"
                    placeholder="Nombre del equipo"
                    value={equipoEditado.nombre}
                    onChange={handleInputChange}
                />
                
                <dt><FileText size={20} color={IconColor.text} style={{margin:"0px 10px"}}/>Descripcion:</dt>
                <TextArea 
                    name="descripcion"
                    placeholder="Descripcion del equipo"
                    value={equipoEditado.descripcion}
                    onChange={handleInputChange}
                />

                <dt><AlertCircle size={20} color={IconColor.risk} style={{margin:"0px 10px"}}/>Nivel de Riesgo:</dt>
                <FormField 
                    name="nivelRiesgo"
                    placeholder="Nivel de riesgo"
                    value={equipoEditado.nivelRiesgo}
                    onChange={handleInputChange}
                />

                <dt><ClipboardList size={20} color={IconColor.checklist} style={{margin:"0px 10px"}}/>NOM Aplicada:</dt>
                <FormField 
                    name="nomAplicada"
                    placeholder="Norma de Mantenmiento aplicada"
                    value={equipoEditado.nomAplicada}
                    onChange={handleInputChange}
                />
                
                <dt><Wrench size={20} color={IconColor.wrench} style={{margin:"0px 10px"}} />Caracteristicas: (Una por linea)</dt>
                <TextArea 
                    name="caracteristicas"
                    placeholder="Caracteristicas (una por linea)"
                    value={equipoEditado.caracteristicas}
                    onChange={handleInputChange}
                />

                <dt><HardHat size={20} color={IconColor.tool} style={{margin:"0px 10px"}}/>Mantenimiento Preventivo: (Una Accion por linea)</dt>
                 <TextArea 
                    name="mantPreventivo"
                    value={equipoEditado.mantPreventivo}
                    placeholder="Ingresa el Mantenimineto Preventivo (una por linea)"
                    onChange={handleInputChange}
                />

                <dt><Drill size={20} color={IconColor.drill} style={{margin:"0px 10px"}}/>Mantenimiento Correctivo: (Una Accion por linea)</dt>
                <TextArea 
                    name="mantCorrectivo"
                    placeholder="Ingresa el Mantenimineto Corectivo (una por linea)"
                    value={equipoEditado.mantCorrectivo}
                    onChange={handleInputChange}
                />

                <dt><ImagePlus size={20} color={IconColor.imagePlus} style={{margin:"0px 10px"}}/>Imagen del Equipo: </dt>
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
                    style={{width:"100%", maxHeight: '100%', objectFit:"cover", marginBottom:'1rem'}}
                    />
                )}

                {mensajeConfirmacion && <p style={{color:"green", marginBottom:"1rem ", textAlign:"center", fontWeight:"bolder"}}>Equipo Agregado con Exito</p>}
                <ButtonsContainer>
                    <ButtonCancelled onClick={handleClose}>Cancelar</ButtonCancelled>
                    <ButtonSaveEquipment onClick={handleSave}>Guardar Cambios</ButtonSaveEquipment>
                </ButtonsContainer>

            </ModalContent>
        </ModalBackground>
    )
   
    

}

export default ModalEditEquipment;