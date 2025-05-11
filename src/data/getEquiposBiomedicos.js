
const getEquiposBiomedicos = () => {
  
    const equiposBiomedicos = [
    {nombre: "Ventilador de Traslado Neonatal", 
      descripcion: "Equipo electromecánico portátil controlado por microprocesador con batería interna, diseñado para soporte ventilatorio en pacientes neonatales durante traslados intra o extra-hospitalarios. Incluye pantalla que muestra gráficas, datos numéricos y alarmas.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: " Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Peso no mayor de 5 kg.", "Pantalla LCD de 5.5'' o mayor.", "Mezclador de aire-oxígeno interno.", "Sensor de flujo reusable.", "Duración de batería mínima de 5 horas."],
      mantPreventivo: ["Limpieza externa con paño húmedo y solución desinfectante no corrosiva.", "Revisión y limpieza de filtros de aire.", "Verificación de alarmas y funcionamiento de la batería.", "Calibración de sensores de presión y flujo según especificaciones del fabricante."],
      mantCorrectivo: ["Reemplazo de componentes defectuosos como sensores, válvulas o baterías.", "Revisión y reparación de circuitos electrónicos internos.", "Actualización de software si aplica."],
      img: "https://www.beracahmedica.mx/web/image/product.template/23593/image_1024?unique=6d805c5"
    },

    {nombre: "Unidad de Autotransfusión para Recuperación Completa de Sangre", 
        descripcion: "Equipo semiportátil automatizado que recupera la sangre extravasada durante el acto quirúrgico y purifica los componentes sanguíneos.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Sistema con pantalla para despliegue de datos.","Bomba peristáltica de alta velocidad.","Detector de burbujas.","Centrífuga de velocidad ajustable."],
      mantPreventivo: ["Limpieza y desinfección de componentes en contacto con sangre.","Verificación de funcionamiento de bombas y sensores.","Calibración de sistemas de medición de volumen y presión."],
      mantCorrectivo: ["Reemplazo de piezas desgastadas o dañadas.","Reparación de fallas en el sistema de control o en los circuitos eléctricos."],
      img: "https://avanaplasticsurgery.com/themes/avana/images/cell-saver-machine.jpg"
    },

    {nombre: "Espirómetro Computarizado con Neumotacógrafo", 
      descripcion: "Equipo para el diagnóstico de las alteraciones en la mecánica ventilatoria, que permite la realización de curvas volumen-tiempo y flujo-volumen, con cálculo automático de parámetros y comparación con valores normales.", 
      nivelRiesgo: "Medio (Clase 2)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Computadora portátil con batería.","Impresora portátil de inyección de tinta.","Neumotacógrafo, sensor de flujo y jeringa de calibración."],
      mantPreventivo: ["Limpieza y desinfección de boquillas y tubos después de cada uso.","Calibración periódica utilizando jeringas de calibración estándar.","Inspección y reemplazo de sensores de flujo si es necesario.","Actualización de software y respaldo de datos."],
      mantCorrectivo: ["Reparación o reemplazo de componentes electrónicos defectuosos.","Solución de problemas de comunicación entre el espirómetro y la computadora."],
      img: "https://catalogomedicomx.s3.amazonaws.com/produccion/img/p/3/2/9/0/2/32902.jpg"
    },

    {nombre: "Medidor de pH Esofágico", 
      descripcion: "Monitor ambulatorio de pH esofágico que consta de una unidad portátil ajustable a la cintura para pacientes ambulatorios, con capacidad de grabación de al menos 24 horas.", 
      nivelRiesgo: "Medio (Clase 2)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Entrada de 1 a 3 canales.","Rango de medición de 1.0 a 8.0 pH.","Capacidad de descarga inalámbrica de datos."],
      mantPreventivo: ["Limpieza del cuerpo del equipo y verificación de conexiones.", "Calibración del sistema utilizando soluciones buffer conocidas.","Mantenimiento diario del electrodo: enjuague con agua destilada y almacenamiento en solución buffer."],
      mantCorrectivo: ["Reemplazo de electrodos dañados o desgastados.", "Reparación de fallas en el sistema de lectura o en la unidad de almacenamiento de datos."],
      img: "https://www.innovid.com.co/wp-content/uploads/2021/04/Fisiologia-al4.jpg"
    },

    {nombre: "Unidad de Ósmosis Inversa Portátil para Hemodiálisis", 
      descripcion: "Equipo de tratamiento de agua por ósmosis inversa para uso en hemodiálisis, que opera a base de diferentes filtros, resinas y membranas para eliminar impurezas químicas y microbiológicas del agua.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Pre-tratamiento de agua con filtros sedimentadores y de carbón activado.","Capacidad mínima de producción de 1.5 l/min de agua grado hemodiálisis.","Sistema de monitoreo de presión y flujo."],
      mantPreventivo: ["Limpieza y desinfección regular del sistema de filtrado.", "Revisión y reemplazo de filtros y membranas según el programa de mantenimiento.", "Verificación de presión y flujo en el sistema."],
      mantCorrectivo: ["Reparación de fugas o fallas en las bombas.", "Reemplazo de componentes eléctricos o electrónicos defectuosos."],
      img: "https://dtb.com.mx/esp/wp-content/uploads/2016/10/dtb_millenium-400x400.jpg"
    },

    {nombre: "Laringoscopio Óptico", 
      descripcion: "Laringoscopio óptico que auxilia en la introducción del tubo endotraqueal a través de las cuerdas vocales del paciente, compuesto por pieza óptica reutilizable, pala y visor desechables.", 
      nivelRiesgo: "Medio (Clase 2)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Sistema óptico compuesto por lentes plásticos y espejos.","Iluminación LED alimentada por baterías alcalinas.","Sistema anti-niebla."],
      mantPreventivo: ["Limpieza y desinfección de las hojas y mangos después de cada uso.","Verificación del funcionamiento de la luz y del estado de las baterías.", "Esterilización según las recomendaciones del fabricante, evitando métodos que puedan dañar las fibras ópticas."],
      mantCorrectivo: ["Reemplazo de bombillos o baterías defectuosas.","Reparación de conexiones eléctricas o de componentes dañados."],
      img: "https://img.xentra.com.mx/medics360/img/productos/LARINGO_MAC/LARINGO_MAC_842_11_03_22_05_19.webp"
    },

    {nombre: "Videoscopio Flexible", 
      descripcion: "Videoscopio flexible, estéril y desechable, utilizado en procedimientos endoscópicos de las vías respiratorias, apto para procedimientos de lavado broncoalveolar y bronquial.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Conexión al monitor portátil para visualización de imágenes.","Zona de articulación para maniobrar.","Extremo distal con cámara y fuente de luz."],
      mantPreventivo: ["Limpieza y desinfección inmediata después de cada uso.","Verificación de la integridad del tubo flexible y de la calidad de la imagen.","Pruebas de funcionamiento de los controles y articulaciones."],
      mantCorrectivo: ["Reparación de daños en el tubo de inserción o en la unidad de control.","Reemplazo de componentes ópticos o electrónicos defectuosos."],
      img: "https://img.aeroexpo.online/es/images_ar/photo-m2/172101-19747678.jpg"
    },

    {nombre: "Incubador-Autolector para Esterilización con Vapor", 
      descripcion: "Equipo que permite monitorear los procesos de esterilización con vapor a través de la incubación y lectura de indicadores biológicos, controlado por microprocesador.", 
      nivelRiesgo: "Medio (Clase 2)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Lectura de fluorescencia del indicador biológico en menos de tres horas.","Doce pozos para incubación y lectura.","Indicadores luminosos de lectura."],
      mantPreventivo: ["Limpieza regular del interior y exterior del equipo.", "Verificación de la temperatura de incubación y calibración si es necesario.","Pruebas de funcionamiento de los sensores y del sistema de lectura."],
      mantCorrectivo: ["Reparación o reemplazo de sensores de temperatura defectuosos.", "Solución de problemas en el sistema de lectura o en la interfaz de usuario."],
      img: "https://heka.mx/wp-content/uploads/2024/03/incubadora-attest-3m-espe.jpg"
    },

    {nombre: "Cuna de Calor Radiante con Fototerapia Opcional", 
      descripcion: "Equipo electromédico con ruedas que permite controlar manualmente y por servocontrol el ambiente térmico del paciente en estado crítico en un medio abierto.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Elemento de calentamiento tipo radiante.","Regulador para estabilizar la temperatura del paciente.","Alarmas audibles y visibles para alta y baja temperatura."],
      mantPreventivo: ["Limpieza y desinfección de superficies y componentes.","Verificación y calibración de sensores de temperatura.","Revisión del funcionamiento de las lámparas de calor y de fototerapia."],
      mantCorrectivo: ["Reemplazo de lámparas o sensores defectuosos.","Reparación de fallas en el sistema de control de temperatura o en las alarmas."],
      img: "https://heka.mx/wp-content/uploads/2023/09/cuna-calor-radiante-fototerapia.jpg"
    },

    {nombre: "Tromboelastógrafo", 
      descripcion: "Equipo para identificar alteraciones en el proceso de coagulación y desórdenes trombóticos, que permite observar el curso de la fibrinolisis utilizando sangre completa.", 
      nivelRiesgo: "Alto (Clase 3)",
      nomAplicada: "Mantenimiento preventivo y correctivo por personal calificado, conforme al manual de operación.",
      caracteristicas: ["Sistema de viscoelasticidad que presenta valores en forma gráfica y numérica.","Visualización simultánea de dos trazos.","Capacidad de controlar la temperatura de cada columna."],
      mantPreventivo: ["Limpieza y desinfección de componentes en contacto con muestras.","Calibración periódica del sistema según las especificaciones del fabricante.","Verificación del funcionamiento de los sensores y del sistema de análisis."],
      mantCorrectivo: ["Reparación o reemplazo de componentes electrónicos o mecánicos defectuosos.","Actualización de software si aplica."],
      img: "https://img.medicalexpo.es/images_me/photo-m2/95737-16457986.jpg"
    },
    
  ];

  return equiposBiomedicos;

}

export default getEquiposBiomedicos;