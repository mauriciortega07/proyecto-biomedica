import { FileText, AlertCircle, ClipboardList, Wrench, HardHat, Drill, Cable, ImagePlus, CloudUploadIcon, MapPinned } from 'lucide-react';
import {
    ModalBackground, ModalContent,
    FormField,
    TextArea,
    TitleModal,
    ButtonStartEquipment,
    ButtonYes,
    ButtonRestart,
    ButtonOther,
    TagsContainer
} from "./styles";
import { useState, useEffect, lazy, use } from "react";
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

function normalizarEquipo(equipoModal) {
    return {
        id: equipoModal.id || `${equipoModal.nombre}-${Date.now()}`,
        nombre: equipoModal.nombre || 'Sin nombre',
        img: equipoModal.img || equipoModal.imagen || 'https://via.placeholder.com/350',
        descripcion: equipoModal.descripcion || '',
        tipoDispositivo: equipoModal.tipoDispositivo || 'No definido',
        activoEnInventario: equipoModal.activoEnInventario,
        ubicacion: equipoModal.ubicacion || 'sin ubicacion en el inventaro',
        nivelRiesgo: equipoModal.nivelRiesgo || 'No definido',
        nomAplicada: equipoModal.nomAplicada || '',
        caracteristicas: equipoModal.caracteristicas || (equipoModal.respuestasSi?.length > 0 ? equipoModal.respuestasSi?.map(r => `${r.caracteristica} → Si`) : ['Sin características definidas']),
        mantPreventivo: equipoModal.mantPreventivo || [],
        mantCorrectivo: equipoModal.mantCorrectivo || [],
        editadoPor: equipoModal.editadoPor || '',
        fechaModificacion: equipoModal.fechaModificacion || '',
        agregadoPor: equipoModal.agregadoPor || '',
        fechaAgregado: equipoModal.fechaAgregado || '',

    };
}

const ModalFilterEquipment = ({ mostrarModalEquiposPorFiltro, setMostrarModalEquiposPorFiltro, setEquiposIniciales } = {}) => {
    const [equipo, setEquipo] = useState('');
    const [equipoIngresado, setEquipoIngresado] = useState(false);
    const [hiloActual, setHiloActual] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [resultado, setResultado] = useState(null);
    const [imagenUrl, setImagenUrl] = useState('');
    const [respuestasSi, setRespuestasSi] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [activoEnInventario, setActivoEnInventario] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [tipoDispositivo, setTipoDispositivo] = useState('');
    const [nomAplicada, setNomAplicada] = useState('');
    const [mantPreventivo, setMantPreventivo] = useState('');
    const [mantCorrectivo, setMantCorrectivo] = useState('');
    const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

    const parseList = (texto) => texto.split("\n").map((item) => item.trim()).filter(Boolean);

    const arbolNoInvasivo = {
        question: "¿El dispositivo esta destinado a la conduccion o almacenamiento para perfusion,administarcion o introduccion en el cuerpo?",
        options: [
            { label: "Si", result: "Clase 1" },
            {
                label: "No",
                next: {
                    question: "¿Se usa con sangre, fluidos, o tejidos corporales, liquidos o gases?",
                    options: [
                        { label: "Si", result: "Clase 2" },
                        {
                            label: "No",
                            next: {
                                question: "¿Puede ser conectado a un dispositivo medicos de Clase 2 o Clase 3?",
                                options: [
                                    { label: "Si", result: "Clase 2" },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿Esta destinado a modificar la composicion biologica o quimica de la sangre, de otros fluidos corporales o de otros liquidos destinados a introducirse en el cuerpo?",
                                            options: [
                                                { label: "Si", result: "Clase 3" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿El tratamiento consiste en filtracion, centrifugacion o intercambios de gases o de calor?",
                                                        options: [
                                                            { label: "Si", result: "Clase 2" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿Esta en contacto con la piel lesionada(como barrera mecanica, para compresion o para absorcion de exudados)?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 1" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿Esta destinado principalmente a utilizarse con heridas que hayan producido ruptura de la dermis y solo pueden cicatrizar por segunda intencion?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 2" },
                                                                                    {
                                                                                        label: "No",
                                                                                        next: {
                                                                                            question: "¿Esta destinado para actuar en el microentorno de una herida?",
                                                                                            options: [
                                                                                                { label: "Si", result: "Clase 2" }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const arbolDiagnostico = {
        //R-18
        question: "¿Los agentes de diagnostico in vivo, medios de contraste son administrados por via oral o rectal?",
        options: [
            { label: "Si", result: "Clase 2" },
            {
                label: "No",
                next: {
                    question: "¿Los agentes de diagnostico in vivo, radiofarmacos y medios de contraste son administrados por via intravenosa y/o intratecal?",
                    options: [
                        { label: "Si", result: "Clase 3" },
                        {
                            label: "No",
                            next: {
                                //R-19
                                question: "¿Los agentes de diagnóstico in vitro destinados a detectar agentes transmisibles en sangre, tejidos o enfermedades que amenazan la vida, con alto riesgo de propagación, deben ser clasificados como de alto riesgo?",
                                options: [
                                    { label: "Si", result: "Clase 2" },
                                    {
                                        label: "No",
                                        next: {
                                            //R-20
                                            question: "¿El dispositivo que se usa para analizar la sangre o los tejidos y asegurar que sean compatibles antes de una transfusión o trasplante deben considerarse de alto riesgo?",
                                            options: [
                                                { label: "Si", result: "Clase 2" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        //R-21
                                                        question: "¿Los dispositivos de diagnóstico in vitro, incluidos reactivos, calibradores y controles, utilizados para detectar infecciones, realizar tamizajes prenatales, pruebas genéticas, monitorear tratamientos o diagnosticar enfermedades graves que puedan poner en riesgo la vida o causar daños graves, deben considerarse de alto riesgo?",
                                                        options: [
                                                            { label: "Si", result: "Clase 1" },
                                                            { label: "No", result: "Clase 2" }
                                                        ]
                                                    }

                                                }
                                            ]
                                        }

                                    }
                                ]

                            }
                        }

                    ]
                }
            }
        ]


    };

    const arbolInvasivo = {
        question: "¿Tipo Quirúrgico?",
        options: [

            {
                label: "Si",
                next: {
                    question: "¿Dispositivo medico implantable?",
                    options: [
                        {
                            label: "Si",
                            //R-8 
                            next: {
                                question: "¿El dispositivo esta destinado a colocarse dentro de los dientes?",
                                options: [
                                    { label: "Si", result: "Clase 2" },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿El dispositivo se utiliza en contacto directo con el corazon, el sistema circulatorio central o el sistema nervioso central?",
                                            options: [
                                                { label: "Si", result: "Clase 3" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿El dispositivo ejerce un efecto biologico o ser absorbido, totalmente o en gran parte?",
                                                        options: [
                                                            { label: "Si", result: "Clase 3" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿El dispositivo experimenta modificaciones quimicas en el organismo (Excepto si se colocan en los dientes), o administrar medicamentos?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 3" }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: "No",
                            next: {
                                question: "¿Es de uso prolongado?",
                                options: [
                                    {
                                        label: "Si",
                                        //R-8 
                                        next: {
                                            question: "¿El dispositivo esta destinado a colocarse dentro de los dientes?",
                                            options: [
                                                { label: "Si", result: "Clase 2" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿El dispositivo se utiliza en contacto directo con el corazon, el sistema circulatorio central o el sistema nervioso central?",
                                                        options: [
                                                            { label: "Si", result: "Clase 3" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿El dispositivo ejerce un efecto biologico o ser absorbido, totalmente o en gran parte?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 3" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿El dispositivo experimenta modificaciones quimicas en el organismo (Excepto si se colocan en los dientes), o administrar medicamentos?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 3" }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿Es de uso a corto plazo?",
                                            options: [

                                                {
                                                    label: "Si",
                                                    //R-7
                                                    next: {
                                                        question: "¿Esta destinado especificamente a controlar, diagnosticar, vigilar o corregir una alteración cardíaca o del aparato circulatorio central por contacto directo con estas partes del cuerpo?",
                                                        options: [
                                                            { label: "Si", result: "Clase 3" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿Esta en contacto directo con el sistema nervioso central?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 3" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿Se destina a ejercer un efecto biológico o a ser absorbidos totalmente o en gran parte?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 3" },
                                                                                    {
                                                                                        label: "No",
                                                                                        next: {
                                                                                            question: "¿El equipo experimenta modificaciones químicas en el organismo, (excepto si se colocan dentro de los dientes), o administrar medicamentos?",
                                                                                            options: [
                                                                                                { label: "Si", result: "Clase 3" },
                                                                                                { label: "No", result: "Clase 2" }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿Uso Pasajero?",
                                                        options: [
                                                            //R-6
                                                            {
                                                                label: "Si",
                                                                next: {
                                                                    question: "¿El dispositivo se destina especificamente a controlar, diagnosticar, vigilar o corregir una alteración cardíaca o del aparato circulatorio central por contacto directo con estas partes del cuerpo?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 3" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿El dispositivo es un instrumento quirurgico reutilizable?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 1" },
                                                                                    {
                                                                                        label: "No",
                                                                                        next: {
                                                                                            question: "¿El dispositivo esta en contacto directo con sistema nervioso central?",
                                                                                            options: [
                                                                                                { label: "Si", result: "Clase 3" },
                                                                                                {
                                                                                                    label: "No",
                                                                                                    next: {
                                                                                                        question: "¿El dispositivo se destina a suministrar energia en forma de radiaciones ionizantes",
                                                                                                        options: [
                                                                                                            { label: "Si", result: "Clase 2" },
                                                                                                            {
                                                                                                                label: "No",
                                                                                                                next: {
                                                                                                                    question: "¿El dispositivo se destina a ejercer un efecto biológico o a ser absorbidos totalmente o en gran parte?",
                                                                                                                    options: [
                                                                                                                        { label: "Si", result: "Clase 3" },
                                                                                                                        {
                                                                                                                            label: "No",
                                                                                                                            next: {
                                                                                                                                question: "¿El dispositivo se destina a  la administración de medicamentos mediante un sistema de suministro, de manera peligrosa",
                                                                                                                                options: [
                                                                                                                                    { label: "Si", result: "Clase 3" },
                                                                                                                                    { label: "No", result: "Clase 2" }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        }
                                                                                                                    ]
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            //R-5
            {
                label: "No",
                next: {
                    question: "¿El dispositivo esta destinado a ser conectado a un dispositivo medico activo o esta destinado a ser conectado a un dispositivo medico activo de la Clase I?",
                    options: [

                        { label: "Si", result: "Clase 2" },
                        {
                            label: "No",
                            next: {
                                question: "¿Es de uso pasajero?",
                                options: [
                                    { label: "Si", result: "Clase 1" },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿Es de uso a corto plazo?",
                                            options: [
                                                { label: "Si", result: "Clase 2" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿Se utiliza en la cavidad oral, en el conducto auditivo externo o en una cavidad nasal?",
                                                        options: [
                                                            { label: "Si", result: "Clase 1" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿Es de uso prolongado?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 3" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿Se utiliza en la cavidad oral, en el conducto auditivo externo o en una cavidad nasal y no pueden ser absorbidos por la membrana mucosa?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 2" },
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const arbolHigienico = {
        question: "¿El dispositivo es utilizado en la cavidad oral hasta la faringe, en el conducto auditivo externo hasta el tímpano, o en la cavidad nasal o vaginal sin ser absorbido por la membrana mucosa?",
        options: [
            { label: "Si", result: "Clase 1" },
            {
                label: "No",
                next: {
                    question: "¿El dispositivo es de uso externo en la epidermis, sistema piloso y capilar, uñas, labios u órganos genitales externos, y sólo entra en contacto con la piel intacta o no es absorbido por la membrana mucosa?",
                    options: [
                        { label: "Si", result: "Clase 1" },
                        {
                            label: "No",
                            next: {
                                question: "¿El dispositivo es un lubricante para uso en genitales externos y/o en la vagina?",
                                options: [
                                    { label: "Si", result: "Clase 2" }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const arbolBajoRiesgo = {
        question: "¿El dispositivo es un dispositivo médico de clase I cuya seguridad y eficacia están comprobadas, no requiere presentación estéril, no tiene función de diagnóstico, no es soporte de vida y su uso no representa riesgos de lesiones o daños a la salud?",
        options: [
            { label: "Si", result: "Bajo Riesgo" },
            {
                label: "No",
                next: {
                    question: "¿El dispositivo es un producto higiénico destinado al cuidado y aseo personal con efecto directo sobre la salud, cuya calidad, seguridad y eficacia están debidamente sustentadas conforme a los lineamientos y acuerdos específicos vigentes?",
                    options: [
                        { label: "Si", result: "Bajo Riesgo" }
                    ]
                }
            }
        ]
    };

    const arbolActivo = {
        question: "¿Esta destinado a administrar o intercambiar energia?",
        options: [
            { label: "Si", result: "Clase 2" },
            {
                label: "No",
                next: {
                    question: "¿Es de una forma potencialmente peligrosa?",
                    options: [
                        { label: "Si", result: "Clase 3" },
                        {
                            label: "No",
                            next: {
                                question: "¿Esta destinado a controlar o influir directamente el funcionamiento de los dispositivos medicos activos de la clase III?",
                                options: [
                                    { label: "Si", result: "Clase 3" },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿El dispositivo medico activo esta destinado a suministra energia o a crear imagen de la distribucion in vivo de radiofármacos o a permitir un diagnostico directo o a la vigilanica de procesos fisiologicos vitales cuando las variaciones de esos parametros puedan suponer un peligro para la vida del paciente?",
                                            options: [
                                                { label: "Si", result: "Clase 2" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿Esta destinado a emitir radiaciones ionizantes y que se destinen a la radiologia con fines diagnosticos y terapeuticos, incluidos los dispositivos médicos para controlar o vigilar dichos dispositivos médicos, o que influyan directamente en el funcionamiento de los mismos?",
                                                        options: [
                                                            { label: "Si", result: "Clase 3" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿El dispositivo medico activo esta destinados a administrar medicamentos, líquidos corporales u otras sustancias al organismo, o a extraerlos del mismo?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 2" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿Es de una forma pontencialmente peligrosa?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 3" },
                                                                                    { label: "No", result: "Clase 1" }
                                                                                ]
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]

                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const arbolReglasEspeciales = {
        question: "¿El dispositivo incorpora un fármaco o medicamento, o una sustancia derivada de la sangre humana?",
        options: [
            { label: "Si", result: "Clase 3" },
            {
                label: "No",
                next: {
                    question: "¿El dispositivo es utilizado con fines anticonceptivos o para prevenir la transmisión de enfermedades de transmisión sexual?",
                    options: [
                        { label: "Si", result: "Clase 2" },
                        {
                            label: "No",
                            next: {
                                question: "¿El dispositivo es un dispositivo médico implantable o invasivo de uso prolongado?",
                                options: [
                                    { label: "Si", result: "Clase 3" },
                                    {
                                        label: "No",
                                        next: {
                                            question: "¿El dispositivo está destinado a la desinfección o descontaminación de dispositivos médicos que tienen contacto solo con la piel intacta, superficies de equipo médico o áreas hospitalarias o médicas?",
                                            options: [
                                                { label: "Si", result: "Clase 1" },
                                                {
                                                    label: "No",
                                                    next: {
                                                        question: "¿El dispositivo está destinado a la desinfección y/o esterilización química como punto final del proceso de otros dispositivos médicos, de acuerdo con su finalidad de uso?",
                                                        options: [
                                                            { label: "Si", result: "Clase 2" },
                                                            {
                                                                label: "No",
                                                                next: {
                                                                    question: "¿El dispositivo está destinado a la desinfección, limpieza, enjuague o hidratación de lentes de contacto?",
                                                                    options: [
                                                                        { label: "Si", result: "Clase 2" },
                                                                        {
                                                                            label: "No",
                                                                            next: {
                                                                                question: "¿El dispositivo está elaborado utilizando tejidos de animales, humanos o derivados transformados, y su seguridad, calidad y eficacia están demostradas?",
                                                                                options: [
                                                                                    { label: "Si", result: "Clase 3" },
                                                                                    {
                                                                                        label: "No",
                                                                                        next: {
                                                                                            question: "¿El dispositivo se tarata de una bolsa de sangre?",
                                                                                            options: [
                                                                                                { label: "Si", resul: "Clase 3" }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }

                                                                    ]
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    };

    const handleEmpezarArbol = () => {
        if (!equipo.trim() || !tipoDispositivo) {
            alert("Por favor, completa el nombre y selecciona el tipo de dispositivo.");
            return;
        }


        let arbolSeleccionado = null;

        switch (tipoDispositivo) {
            case "dispositivo medico no invasivo":
                arbolSeleccionado = arbolNoInvasivo;
                break;
            case "dispositivo medico invasivo":
                arbolSeleccionado = arbolInvasivo;
                break;
            case "agente de diagnostico":
                arbolSeleccionado = arbolDiagnostico;
                break;
            case "producto higienico":
                arbolSeleccionado = arbolHigienico;
                break;
            case "dispositivo medico de bajo riesgo":
                arbolSeleccionado = arbolBajoRiesgo;
                break;
            case "dispositivo medico activo":
                arbolSeleccionado = arbolActivo;
                break;
            case "reglas especiales":
                arbolSeleccionado = arbolReglasEspeciales;
                break;
            default:
                return;
        }

        setHiloActual(arbolSeleccionado);
        setEquipoIngresado(true);
    };

    const handleGuardarEquipoEnDB = async (equipo) => {
        try {
            const response = await fetch("https://backend-proyecto-biomedica-production.up.railway.app/equipos_biomedicos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(equipo)
            });
            //if (!response.ok) throw new Error("Error al guardar equipo");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar equipo: ${errorText}`);
            }
            const equipoGuardado = await response.json();

            const equipoNormalizadoDesdeBD = normalizarEquipo(equipoGuardado.equipo);

            setEquiposIniciales(prev => [...prev, equipoNormalizadoDesdeBD]);
            //setEquiposIniciales(prev => [...prev, equipoGuardado]);
            setMensajeConfirmacion("Equipo Agregado con Éxito");

            setTimeout(() => {
                setMostrarModalEquiposPorFiltro(false);
                setMensajeConfirmacion("")

            }, 5000)

            console.log("Equipo guardado desde backend:", equipoGuardado);
            console.log("Equipo normalizado:", equipoNormalizadoDesdeBD);



        } catch (error) {
            console.error("Error al guardar en DB:", error);
            setMensajeConfirmacion("Error al guardar el equipo en la base de datos.");
        }
    };

    const handleOpcionClick = (option) => {

        if (option.label === "Si") {
            setRespuestasSi([...respuestasSi, {
                caracteristica: hiloActual.question,
                respuesta: option.label
            }]);
        }


        //if (!option.result) return;


        if (option.result) {
            //const usuarioSesion = localStorage.getItem('user_session') || 'Anonimo';

            const userSession = JSON.parse(localStorage.getItem("user_session"));
            const nombreUsuarioEnSesion = userSession?.name || "Anonimo";
            const fechaActual = new Date().toLocaleString('es-MX', {
                day: '2-digit', month: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: true,
            });


            setResultado(option.result);
            const usuario_id = userSession?.id || null;

            const equipoModal = {
                nombre: equipo,
                descripcion: descripcion || 'No especificada',
                tipoDispositivo,
                activoEnInventario: activoEnInventario,
                ubicacion: ubicacion || 'sin ubicacion en el inventario',
                imagen: imagenUrl,
                respuestasSi: [...respuestasSi, {
                    caracteristica: hiloActual.question,
                    respuesta: option.label === "Si"
                }].filter(r => r.respuesta === "Si"),
                nivelRiesgo: option.result,
                nomAplicada: nomAplicada || 'No especificada',
                
                mantPreventivo: mantPreventivo ? mantPreventivo.split('\n').map(p => p.trim()) : ['Sin mantenimiento preventivo definido'],
                mantCorrectivo: mantCorrectivo ? mantCorrectivo.split('\n').map(c => c.trim()) : ['Sin mantenimiento correctivo definido'],
                agregadoPor: nombreUsuarioEnSesion,
                fechaAgregado: fechaActual,
                usuario_id
            };


            const equipoNormalizado = normalizarEquipo(equipoModal);
            console.log("Equipo a guardar:", equipoNormalizado);
            handleGuardarEquipoEnDB(equipoNormalizado);


            /*const almacenados = JSON.parse(localStorage.getItem('equiposEvaluados') || '[]');
            const nuevosEquipos = [...almacenados, equipoNormalizado];
            localStorage.setItem('equiposEvaluados', JSON.stringify(nuevosEquipos));*/

            setMensajeConfirmacion("Equipo Agregado con Exito");

        } else if (option.next) {
            setHistorial([...historial, hiloActual]);
            setHiloActual(option.next);
        }


    };

    const handleReiniciarArbol = () => {
        setEquipo('');
        setEquipoIngresado(false);
        setHiloActual(null);
        setHistorial([]);
        setResultado(null);
        setActivoEnInventario('');
        setUbicacion('');
        setImagenUrl('');
        setRespuestasSi([]);
        setDescripcion('');
        setTipoDispositivo('');
        setNomAplicada('');
        setMantPreventivo('');
        setMantCorrectivo('');
        setMensajeConfirmacion('');
    };


    useEffect(() => {
        if (!mostrarModalEquiposPorFiltro) {
            handleReiniciarArbol();
            setMensajeConfirmacion('');
        }
    }, [mostrarModalEquiposPorFiltro]);

    const renderUbication = () => {
        if (activoEnInventario === 'si') {
            return (
                <>
                    <TagsContainer><MapPinned size={20} color={IconColor.text} style={{ margin: "10px 0px" }} />Ubicacion: </TagsContainer>
                    <FormField
                        name="ubicacion"
                        placeholder="define su ubicacion"
                        value={ubicacion}
                        onChange={(e) => setUbicacion(e.target.value)}
                        required
                    />
                </>
            )
        }

    }

    if (!mostrarModalEquiposPorFiltro) return null;

    return (
        <ModalBackground onClick={() => setMostrarModalEquiposPorFiltro(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {!equipoIngresado ? (
                    <>
                        <TitleModal>Nuevo Equipo Mediante Toma de Decisiones</TitleModal>
                        <TagsContainer><Cable size={20} color={IconColor.cable} style={{ margin: "0px 10px" }} />Nombre del equipo</TagsContainer>
                        <FormField
                            type="text"
                            value={equipo}
                            onChange={(e) => setEquipo(e.target.value)}
                            placeholder="nombre del equipo"
                        />

                        <TagsContainer><ClipboardList size={20} color={IconColor.checklist} style={{ margin: "0px 10px" }} />Tipo de Dispositivo:</TagsContainer>
                        <select
                            style={{ width: "100%", padding: "8px", borderRadius: "5px", marginBottom: "1rem" }}
                            value={tipoDispositivo}
                            onChange={(e) => setTipoDispositivo(e.target.value)}
                        >
                            <option value="">Seleccionar tipo...</option>
                            <option value="dispositivo medico no invasivo">Dispositivo médico no invasivo</option>
                            <option value="dispositivo medico invasivo">Dispositivo médico invasivo</option>
                            <option value="agente de diagnostico">Agente de diagnóstico</option>
                            <option value="producto higienico">Producto higiénico</option>
                            <option value="dispositivo medico de bajo riesgo">Dispositivo médico de bajo riesgo</option>
                            <option value="dispositivo medico activo">Dispositivo médico activo</option>
                            <option value="reglas especiales">Reglas especiales</option>
                        </select>

                        <TagsContainer><CloudUploadIcon size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />¿Esta activo en el inventario?:</TagsContainer>
                        <div size={20} color={IconColor.text} style={{ margin: "20px 10px" }}>
                            <label size={20} color={IconColor.text}>
                                <input
                                    type='radio'
                                    name="activoEnInventario"
                                    value='si'
                                    checked={activoEnInventario === 'si'}
                                    onChange={(e) => setActivoEnInventario(e.target.value)}
                                    required
                                />
                                Si
                            </label>
                            <label size={20} color={IconColor.text}>
                                <input
                                    type='radio'
                                    name="activoEnInventario"
                                    value='no'
                                    checked={activoEnInventario === 'no'}
                                    onChange={(e) => setActivoEnInventario(e.target.value)}
                                    required
                                />
                                No
                            </label>

                            {renderUbication()}
                        </div>

                        <TagsContainer><FileText size={20} color={IconColor.text} style={{ margin: "0px 10px" }} />Descripcion:</TagsContainer>
                        <TextArea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Ejemplo: Equipo portátil diseñado para ventilación neonatal..."
                        />

                        <TagsContainer><ClipboardList size={20} color={IconColor.checklist} style={{ margin: "0px 10px" }} />NOM Aplicada:</TagsContainer>
                        <FormField
                            value={nomAplicada}
                            onChange={(e) => setNomAplicada(e.target.value)}
                            placeholder="Ejemplo: Mantenimiento conforme al manual de operación"
                        />


                        <TagsContainer><HardHat size={20} color={IconColor.tool} style={{ margin: "0px 10px" }} />Mantenimiento Preventivo (opcional): </TagsContainer>
                        <TextArea
                            value={mantPreventivo}
                            onChange={(e) => setMantPreventivo(e.target.value)}
                            placeholder="Ejemplo: Limpieza, revisión visual de conexiones..."
                        />

                        <TagsContainer><Drill size={20} color={IconColor.drill} style={{ margin: "0px 10px" }} />Mantenimiento Correctivo (opcional): </TagsContainer>
                        <TextArea
                            value={mantCorrectivo}
                            onChange={(e) => setMantCorrectivo(e.target.value)}
                            placeholder="Ejemplo: Reemplazo de piezas dañadas, calibración..."
                        />

                        <TagsContainer><ImagePlus size={20} color={IconColor.imagePlus} style={{ margin: "0px 10px" }} />Imagen del Equipo: </TagsContainer>
                        <FormField
                            type="text"
                            value={imagenUrl}
                            onChange={(e) => setImagenUrl(e.target.value)}
                            placeholder="https://..."
                        />

                        <ButtonStartEquipment onClick={handleEmpezarArbol} disabled={!equipo.trim()}>Comenzar</ButtonStartEquipment>

                    </>
                ) : !resultado ? (
                    <>
                        <TitleModal>Equipo: {equipo}</TitleModal>
                        <h2 style={{ margin: "1rem 0rem" }}>{hiloActual.question}</h2>
                        {hiloActual.options.map((option, index) => (
                            <ButtonYes key={index} onClick={() => handleOpcionClick(option)}>
                                {option.label}
                            </ButtonYes>
                        ))}
                        <ButtonRestart onClick={handleReiniciarArbol}>Reiniciar</ButtonRestart>
                    </>
                ) : (
                    <>
                        <TitleModal>Equipo: {equipo}</TitleModal>
                        <TitleModal>Resultado final: {resultado}</TitleModal>
                        <ButtonOther onClick={handleReiniciarArbol}>Evaluar Otro</ButtonOther>
                        <ButtonRestart onClick={handleReiniciarArbol}>Reiniciar</ButtonRestart>
                    </>
                )

                }
                {mensajeConfirmacion && <p style={{ color: "green", marginBottom: "1rem ", textAlign: "center", fontWeight: "bolder" }}>Equipo Agregado con Exito</p>}
            </ModalContent>

        </ModalBackground >

    );
}

export default ModalFilterEquipment;