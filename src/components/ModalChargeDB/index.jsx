import {
    FileText,
    AlertCircle,
    ClipboardList,
    Wrench,
    HardHat,
    Drill,
    Cable,
    ImagePlus,
    CloudUploadIcon,
    MapPinned,
    FileDigit
} from "lucide-react";
import ModalEditEquipment from "../ModalEditEquipment";

import {
    ModalBackground,
    ModalContent,
    TitleModal,
    ButtonRestart,
    ContainerGral,

    FormField,
    TextArea,
    ButtonStartEquipment,
    ButtonYes,
    ButtonOther,
    TagsContainer
} from "./styles";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const IconColor = {
    user: "#007BFF",
    text: "#6C757D",
    risk: "#DC3545",
    checklist: "#17A2B8",
    tool: "#28A745",
    wrench: "#FFC107",
    drill: "#ca7f05",
    cable: "#DC3545",
    imagePlus: "#EA40D0",
    cloudUploadIcon: "#EA40D0",
    mapPinned: "#17A2B8"
};

const REQUIRED_COLUMNS = [
    "nombre",
    "descripcion",
    "tipoDispositivo",
    "activoEnInventario",
    "ubicacion",
    "numInventario",
    "numSerieEquipo",
    "nomAplicada",
    "caracteristicas",
    "mantPreventivo",
    "mantCorrectivo",
    "img"
];

const PRETTY_HEADERS = {
    nombre: "Nombre",
    descripcion: "Descripción",
    tipoDispositivo: "Tipo Dispositivo",
    activoEnInventario: "Activo En Inventario",
    ubicacion: "Ubicación",
    numInventario: "Número Inventario",
    numSerieEquipo: "Número Serie Equipo",
    nivelRiesgo: "Nivel de Riesgo",
    nomAplicada: "Norma Aplicada",
    caracteristicas: "Características",
    mantPreventivo: "Mantenimiento Preventivo",
    mantCorrectivo: "Mantenimiento Correctivo",
    img: "Imagen URL"
};

// Normaliza headers: quita acentos, espacios, etc.
const normalizeKey = (key) => {
    if (!key) return "";
    return key
        .toString()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "");
};

// Convierte fila original en fila con llaves normalizadas
const normalizeRowKeys = (row) => {
    const normalized = {};

    for (const k of Object.keys(row)) {
        const nk = normalizeKey(k);

        if (nk.toLowerCase() === "ubicacion") {
            normalized["ubicacion"] = row[k];
        } else {
            normalized[nk] = row[k];
        }
    }

    return normalized;
};

const formatHeader = (col) => {
    if (!col) return "";
    if (PRETTY_HEADERS[col]) return PRETTY_HEADERS[col];

    const clean = col.toString().trim().replace(/_/g, " ");
    const withSpaces = clean.replace(/([a-z])([A-Z])/g, "$1 $2");

    return withSpaces
        .split(" ")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

const ModalChargeDB = ({ mostrarModalChargeDB, setMostrarModalChargeDB, setEquiposIniciales }) => {
    const [file, setFile] = useState(null);
    const [rowsPreview, setRowsPreview] = useState([]);
    const [errors, setErrors] = useState([]);
    const [previewColumns, setPreviewColumns] = useState([]);

    const [modalEditEquipment, setModalEditEquipment] = useState(false);
    const [equipoAEditar, setEquipoAEditar] = useState(null);
    const [indexAEditar, setIndexAEditar] = useState(null);


    // ✅ Vistas del modal
    // UPLOAD = Excel + Preview
    // DECISION = Vista de evaluación (toma de decisiones)
    const [viewMode, setViewMode] = useState("UPLOAD");
    const [selectedIndex, setSelectedIndex] = useState(null);

    // ✅ Estados reutilizados del ModalFilterEquipment pero adaptados
    const [equipo, setEquipo] = useState("");
    const [equipoIngresado, setEquipoIngresado] = useState(false);
    const [hiloActual, setHiloActual] = useState(null);
    const [historial, setHistorial] = useState([]);
    const [resultado, setResultado] = useState(null);
    const [respuestasSi, setRespuestasSi] = useState([]);
    const [respuestasNo, setRespuestasNo] = useState([]);
    const [tipoDispositivo, setTipoDispositivo] = useState("");

    // ✅ estado para guardado masivo
    const [savingAll, setSavingAll] = useState(false);

    // ============================================================
    // ✅ AQUI PEGAS TUS ARBOLES TAL CUAL (resumí el bloque porque es enorme)
    // 👉 COPIA/PEGA EXACTAMENTE los arboles que ya tienes en ModalFilterEquipment
    // ============================================================

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


    // ============================================================
    // ✅ FIN ARBOLES
    // ============================================================

    if (!mostrarModalChargeDB) return null;

    const handleClose = () => {
        setMostrarModalChargeDB(false);

        setFile(null);
        setRowsPreview([]);
        setErrors([]);
        setPreviewColumns([]);

        resetDecisionState();
        setViewMode("UPLOAD");
        setSelectedIndex(null);
        setSavingAll(false);
    };

    const resetDecisionState = () => {
        setEquipo("");
        setEquipoIngresado(false);
        setHiloActual(null);
        setHistorial([]);
        setResultado(null);
        setRespuestasSi([]);
        setRespuestasNo([]);
        setTipoDispositivo("");
    };

    const validateColumns = (jsonRows) => {
        if (!jsonRows.length) return ["El archivo no contiene filas."];

        const columnsInFile = Object.keys(jsonRows[0] || {});
        const missing = REQUIRED_COLUMNS.filter(
            (col) => !columnsInFile.includes(col)
        );

        if (missing.length > 0) {
            return [`Faltan columnas obligatorias: ${missing.join(", ")}`];
        }

        return [];
    };

    const handleEditRow = (index) => {
        const row = rowsPreview[index];
        if (!row) return;

        setIndexAEditar(index);

        // OJO: ModalEditEquipment espera arrays o strings con \n.
        // Tu preview trae strings (excel). Lo convertimos a la forma que el modal usa.
        const toTextAreaValue = (v) => {
            if (Array.isArray(v)) return v.join("\n");
            return v?.toString() || "";
        };

        setEquipoAEditar({
            ...row,
            caracteristicas: toTextAreaValue(row.caracteristicas),
            mantPreventivo: toTextAreaValue(row.mantPreventivo),
            mantCorrectivo: toTextAreaValue(row.mantCorrectivo)
        });

        setModalEditEquipment(true);
    };

    const applyEditedRow = (equipoEditado) => {
        // equipoEditado ya viene con arrays en caracteristicas/mants (por el updateEquipo)
        setRowsPreview((prev) => {
            const copy = [...prev];
            if (indexAEditar === null || !copy[indexAEditar]) return prev;

            copy[indexAEditar] = {
                ...copy[indexAEditar],
                ...equipoEditado,

                // ✅ Mantén tus campos internos del preview
                _status: copy[indexAEditar]._status || "",
                _error: copy[indexAEditar]._error || "",
                _savedId: copy[indexAEditar]._savedId || null
            };

            return copy;
        });

        // si el usuario editó un guardado que estaba en ERROR o GUARDADO y quieres forzar re-guardar:
        // - si ya estaba guardado, NO lo cambies
        // - si estaba en ERROR, podrías limpiar el error:
        setRowStatus(indexAEditar, { _error: "" });

        setModalEditEquipment(false);
        setEquipoAEditar(null);
        setIndexAEditar(null);
    };


    const handleFileChange = async (e) => {
        const selected = e.target.files?.[0] || null;
        if (!selected) return;

        setFile(selected);
        setRowsPreview([]);
        setErrors([]);
        setPreviewColumns([]);

        resetDecisionState();
        setViewMode("UPLOAD");
        setSelectedIndex(null);

        try {
            const data = await selected.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonRaw = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            const json = jsonRaw.map(normalizeRowKeys);

            const validationErrors = validateColumns(json);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            const columns = Object.keys(json[0] || {});
            if (!columns.includes("nivelRiesgo")) columns.push("nivelRiesgo");
            setPreviewColumns(columns);

            const normalized = json.map((row, index) => ({
                _rowId: index + 1,
                ...row,
                nivelRiesgo: row.nivelRiesgo || "",

                // ✅ estados internos para guardado
                _status: "PENDIENTE", // PENDIENTE | GUARDANDO | GUARDADO | ERROR
                _error: "",
                _savedId: null
            }));

            setRowsPreview(normalized);
        } catch (err) {
            console.error("Error leyendo Excel:", err);
            setErrors(["Error leyendo el Excel. Verifica que sea un .xlsx válido."]);
        }
    };

    // ✅ Botón Evaluar de una fila
    const handleEvaluateRow = (index) => {
        resetDecisionState();

        const row = rowsPreview[index];
        if (!row) return;

        setSelectedIndex(index);

        // Prefill
        setEquipo(row.nombre || "Sin nombre");
        setTipoDispositivo(row.tipoDispositivo || "");

        setViewMode("DECISION");
    };

    // ✅ Comienza árbol según tipoDispositivo (MISMO switch que tu ModalFilterEquipment)
    const handleEmpezarArbol = () => {
        if (!equipo.trim() || !tipoDispositivo) {
            alert("Por favor, selecciona el tipo de dispositivo.");
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

    // ✅ Cuando terminas la evaluación -> asignar nivelRiesgo a la fila del Excel
    const handleOpcionClick = (option) => {
        if (option.label === "Si") {
            setRespuestasSi((prev) => [
                ...prev,
                { caracteristica: hiloActual.question, respuesta: option.label }
            ]);
        }

        if (option.label === "No") {
            setRespuestasNo((prev) => [
                ...prev,
                { caracteristica: hiloActual.question, respuesta: option.label }
            ]);
        }

        if (option.result) {
            setResultado(option.result);

            // ✅ Actualiza el nivelRiesgo de la fila evaluada
            setRowsPreview((prev) => {
                const copy = [...prev];
                if (selectedIndex !== null && copy[selectedIndex]) {
                    copy[selectedIndex] = {
                        ...copy[selectedIndex],
                        nivelRiesgo: option.result,
                        tipoDispositivo: tipoDispositivo
                    };
                }
                return copy;
            });

            // ✅ Regresa al preview
            setTimeout(() => {
                setViewMode("UPLOAD");
                setSelectedIndex(null);
                resetDecisionState();
            }, 200);
        } else if (option.next) {
            setHistorial((prev) => [...prev, hiloActual]);
            setHiloActual(option.next);
        }
    };

    const handleReiniciarArbol = () => {
        resetDecisionState();
        setViewMode("UPLOAD");
        setSelectedIndex(null);
    };


    const safeJsonParse = (v, fallback = []) => {
        if (Array.isArray(v)) return v;
        if (typeof v !== "string") return fallback;
        try {
            const parsed = JSON.parse(v);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch {
            return fallback;
        }
    };

    const normalizarEquipoDesdeBD = (equipoBD) => {
        if (!equipoBD) return null;

        return {
            ...equipoBD,
            caracteristicas: safeJsonParse(equipoBD.caracteristicas, []),
            mantPreventivo: safeJsonParse(equipoBD.mantPreventivo, []),
            mantCorrectivo: safeJsonParse(equipoBD.mantCorrectivo, [])
        };
    };

    // ============================================================
    // ✅ GUARDADO A BD (INDIVIDUAL Y MASIVO)
    // - nivelRiesgo NO es obligatorio: si está vacío -> "Pendiente"
    // - agrega usuario_id, agregadoPor, fechaAgregado desde user_session
    // ============================================================

    const getUserMeta = () => {
        const userSession = JSON.parse(localStorage.getItem("user_session"));
        const nombreUsuarioEnSesion = userSession?.name || "Anonimo";
        const usuario_id = userSession?.id || null;

        const fechaActual = new Date().toLocaleString("es-MX", {
            day: "2-digit",
            month: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        return {
            usuario_id,
            agregadoPor: nombreUsuarioEnSesion,
            fechaAgregado: fechaActual
        };
    };

    const buildPayloadFromRow = (row) => {
        const meta = getUserMeta();


        const toBackendValue = (v) => {
            if (Array.isArray(v)) return v;         // backend ya hace JSON.stringify
            if (typeof v === "string") return v;    // si venía crudo del excel
            return "";
        };

        return {
            nombre: row.nombre || "",
            descripcion: row.descripcion || "",
            tipoDispositivo: row.tipoDispositivo || "",
            activoEnInventario: row.activoEnInventario || "",
            ubicacion: row.ubicacion || "",
            numInventario: row.numInventario || "",
            numSerieEquipo: row.numSerieEquipo || "",

            // ✅ NO obligatorio
            nivelRiesgo: row.nivelRiesgo && row.nivelRiesgo.toString().trim() !== ""
                ? row.nivelRiesgo
                : "Pendiente",

            nomAplicada: row.nomAplicada || "",
            caracteristicas: toBackendValue(row.caracteristicas),
            mantPreventivo: toBackendValue(row.mantPreventivo),
            mantCorrectivo: toBackendValue(row.mantCorrectivo),
            img: row.img || "",

            // ✅ backend adicional
            usuario_id: meta.usuario_id,
            agregadoPor: meta.agregadoPor,
            fechaAgregado: meta.fechaAgregado
        };
    };

    const setRowStatus = (index, patch) => {
        setRowsPreview((prev) => {
            const copy = [...prev];
            if (!copy[index]) return prev;
            copy[index] = { ...copy[index], ...patch };
            return copy;
        });
    };

    const saveRowToDB = async (index) => {
        const row = rowsPreview[index];
        if (!row) return;

        // si ya guardado, no reintentar
        if (row._status === "GUARDADO") return;

        try {
            setRowStatus(index, { _status: "GUARDANDO", _error: "" });

            const payload = buildPayloadFromRow(row);

            const response = await fetch("/api/equipos_biomedicos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al guardar equipo");
            }

            const data = await response.json();
            const savedId = data?.equipo?.id || null;

            setRowStatus(index, {
                _status: "GUARDADO",
                _error: "",
                _savedId: savedId
            });

            // ✅ ACTUALIZA LA VISTA GLOBAL (Catálogo) SIN RECARGAR
            const equipoNormalizado = normalizarEquipoDesdeBD(data?.equipo);

            if (equipoNormalizado && setEquiposIniciales) {
                setEquiposIniciales((prev) => {
                    // evita duplicados por si se re-intenta o el modal se usa varias veces
                    if (savedId && prev?.some((e) => Number(e.id) === Number(savedId))) {
                        return prev;
                    }
                    return [...prev, equipoNormalizado];
                });
            }
        } catch (err) {
            setRowStatus(index, {
                _status: "ERROR",
                _error: err?.message || "Error desconocido al guardar"
            });
        }
    };


    const saveAllToDB = async () => {
        if (rowsPreview.length === 0) return;

        setSavingAll(true);
        try {
            // guarda en secuencia para no saturar el backend
            for (let i = 0; i < rowsPreview.length; i++) {
                // no reintentar guardados
                if (rowsPreview[i]?._status === "GUARDADO") continue;
                await saveRowToDB(i);
            }
        } finally {
            setSavingAll(false);
        }
    };

    // ==========================
    // ✅ VISTA 1: UPLOAD + PREVIEW
    // ==========================
    const renderUploadView = () => (
        <>
            <TitleModal>Cargar equipos desde Excel</TitleModal>

            <ContainerGral>
                <label htmlFor="excelFile">Archivo Excel (.xlsx)</label>
                <input
                    id="excelFile"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                />
            </ContainerGral>

            {file && (
                <p style={{ marginTop: "1rem" }}>
                    Archivo seleccionado: <strong>{file.name}</strong>
                </p>
            )}

            {errors.length > 0 && (
                <div style={{ marginTop: "1rem", color: "red" }}>
                    {errors.map((err, idx) => (
                        <p key={idx} style={{ margin: 0 }}>
                            • {err}
                        </p>
                    ))}
                </div>
            )}

            {rowsPreview.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "1rem",
                            marginBottom: "0.75rem"
                        }}
                    >
                        <h3 style={{ marginBottom: "0.5rem" }}>
                            Previsualización ({rowsPreview.length} equipos)
                        </h3>

                        {/* ✅ Guardar todos */}
                        <button
                            onClick={saveAllToDB}
                            disabled={savingAll}
                            style={{
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: "1px solid #ccc",
                                cursor: savingAll ? "not-allowed" : "pointer",
                                fontWeight: "800",
                                opacity: savingAll ? 0.7 : 1
                            }}
                            title="Guarda todos los equipos (si nivelRiesgo está vacío se manda Pendiente)"
                        >
                            {savingAll ? "Guardando..." : "Guardar todos"}
                        </button>
                    </div>

                    <div
                        style={{
                            maxHeight: "360px",
                            overflowY: "auto",
                            overflowX: "auto",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}
                    >
                        <table style={{ width: "max-content", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f5f5f5" }}>
                                    <th style={{ padding: "8px", textAlign: "left" }}>#</th>

                                    {/* ✅ Acciones */}
                                    <th style={{ padding: "8px", textAlign: "left" }}>Acciones</th>

                                    {/* ✅ Estado */}
                                    <th style={{ padding: "8px", textAlign: "left" }}>Estado</th>

                                    {previewColumns.map((col) => (
                                        <th
                                            key={col}
                                            style={{
                                                padding: "8px",
                                                textAlign: "left",
                                                whiteSpace: "nowrap",
                                                minWidth: "170px"
                                            }}
                                        >
                                            {formatHeader(col)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {rowsPreview.map((row, index) => {
                                    const status = row._status || "PENDIENTE";

                                    return (
                                        <tr key={row._rowId} style={{ borderTop: "1px solid #eee" }}>
                                            <td style={{ padding: "8px" }}>{row._rowId}</td>

                                            {/* ✅ Acciones: Evaluar + Guardar */}
                                            <td style={{ padding: "8px", display: "flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => handleEvaluateRow(index)}
                                                    disabled={status === "GUARDANDO"}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ccc",
                                                        cursor: status === "GUARDANDO" ? "not-allowed" : "pointer",
                                                        fontWeight: "700",
                                                        opacity: status === "GUARDANDO" ? 0.6 : 1
                                                    }}
                                                    title="Evaluar (opcional). Si no evalúas, se guardará como Pendiente."
                                                >
                                                    Evaluar
                                                </button>

                                                <button
                                                    onClick={() => handleEditRow(index)}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ccc",
                                                        cursor: "pointer",
                                                        fontWeight: "700"
                                                    }}
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => saveRowToDB(index)}
                                                    disabled={status === "GUARDANDO" || status === "GUARDADO"}
                                                    style={{
                                                        padding: "8px 12px",
                                                        borderRadius: "8px",
                                                        border: "1px solid #ccc",
                                                        cursor:
                                                            status === "GUARDANDO" || status === "GUARDADO"
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        fontWeight: "800",
                                                        opacity:
                                                            status === "GUARDANDO" || status === "GUARDADO" ? 0.6 : 1
                                                    }}
                                                    title="Guardar este equipo (si nivelRiesgo está vacío se manda Pendiente)"
                                                >
                                                    {status === "GUARDADO" ? "Guardado" : "Guardar"}
                                                </button>
                                            </td>

                                            {/* ✅ Estado */}
                                            <td style={{ padding: "8px", whiteSpace: "nowrap" }}>
                                                <span
                                                    style={{
                                                        fontWeight: "800",
                                                        color:
                                                            status === "GUARDADO"
                                                                ? "#28A745"
                                                                : status === "ERROR"
                                                                    ? "#DC3545"
                                                                    : status === "GUARDANDO"
                                                                        ? "#ca7f05"
                                                                        : "#6C757D"
                                                    }}
                                                >
                                                    {status}
                                                </span>

                                                {row._savedId ? (
                                                    <div style={{ fontSize: "12px", color: "#666" }}>
                                                        id: {row._savedId}
                                                    </div>
                                                ) : null}

                                                {row._error ? (
                                                    <div style={{ fontSize: "12px", color: "#DC3545", maxWidth: 280 }}>
                                                        {row._error}
                                                    </div>
                                                ) : null}
                                            </td>

                                            {/* ✅ Columnas */}
                                            {previewColumns.map((col) => {
                                                let value = row[col];

                                                if (col === "nivelRiesgo" && (!value || value === "")) {
                                                    value = "Pendiente";
                                                }

                                                return (
                                                    <td
                                                        key={col}
                                                        style={{
                                                            padding: "8px",
                                                            whiteSpace: "nowrap",
                                                            maxWidth: "240px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis"
                                                        }}
                                                        title={value?.toString() || ""}
                                                    >
                                                        {value?.toString() || ""}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
                        Puedes <strong>Evaluar</strong> (opcional) para llenar <strong>Nivel de Riesgo</strong>.
                        Si no evalúas, al guardar se enviará como <strong>Pendiente</strong>.
                    </p>
                </div>
            )}

            <div
                style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    gap: "0.75rem",
                    justifyContent: "flex-end"
                }}
            >
                <ButtonRestart onClick={handleClose}>Cerrar</ButtonRestart>
            </div>
        </>
    );

    // ==========================
    // ✅ VISTA 2: DECISION TREE (REUTILIZANDO tu UI)
    // ==========================
    const renderDecisionView = () => (
        <>
            {!equipoIngresado ? (
                <>
                    <TitleModal>Evaluar equipo (Toma de decisiones)</TitleModal>

                    <TagsContainer>
                        <Cable size={20} color={IconColor.cable} style={{ margin: "0px 10px" }} />
                        Equipo a evaluar:
                    </TagsContainer>

                    {/* ✅ Nombre (solo lectura) */}
                    <FormField value={equipo} readOnly />

                    <TagsContainer>
                        <ClipboardList
                            size={20}
                            color={IconColor.checklist}
                            style={{ margin: "0px 10px" }}
                        />
                        Tipo de Dispositivo:
                    </TagsContainer>

                    <select
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "5px",
                            marginBottom: "1rem"
                        }}
                        value={tipoDispositivo}
                        onChange={(e) => setTipoDispositivo(e.target.value)}
                        required
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

                    <ButtonStartEquipment onClick={handleEmpezarArbol}>
                        Comenzar
                    </ButtonStartEquipment>

                    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                        <ButtonRestart onClick={handleReiniciarArbol}>Cancelar</ButtonRestart>
                    </div>
                </>
            ) : !resultado ? (
                <>
                    <TitleModal>Equipo: {equipo}</TitleModal>
                    <TitleModal>Tipo de Dispositivo: {tipoDispositivo}</TitleModal>

                    <h2 style={{ margin: "1rem 0rem" }}>{hiloActual?.question}</h2>

                    {hiloActual?.options?.map((option, index) => (
                        <ButtonYes key={index} onClick={() => handleOpcionClick(option)}>
                            {option.label}
                        </ButtonYes>
                    ))}

                    <ButtonRestart onClick={handleReiniciarArbol}>Cancelar</ButtonRestart>
                </>
            ) : (
                <>
                    <TitleModal>Equipo: {equipo}</TitleModal>
                    <TitleModal>Tipo de Dispositivo: {tipoDispositivo}</TitleModal>
                    <TitleModal>Nivel de Riesgo: {resultado}</TitleModal>

                    <ButtonOther onClick={handleReiniciarArbol}>Volver</ButtonOther>
                </>
            )}
        </>
    );



    return (
        <ModalBackground onClick={handleClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                {viewMode === "UPLOAD" ? renderUploadView() : renderDecisionView()}
                {
                    modalEditEquipment && equipoAEditar && (
                        <ModalEditEquipment
                            equipoAEditar={equipoAEditar}
                            modalEditEquipment={modalEditEquipment}
                            setModalEditEquipment={setModalEditEquipment}

                            // ✅ en preview no queremos tocar BD
                            mode="PREVIEW"
                            onSavePreview={applyEditedRow}
                        />
                    )
                }


            </ModalContent>
        </ModalBackground>
    );
};

export default ModalChargeDB;
