import Header from "../../Header";
import Footer from "../../Footer";
import AsideCategories from "../../Aside";
import { useState } from "react";
import SearchBox from "../../SearchBox";
import useSearchBox from "../../../hooks/useSearchBox";

const TodosEquipos = ({ listaEquipos }) => {
    const [equiposIniciales, setEquiposIniciales] = useState(listaEquipos);

    //HOOK PERSONALIZADO QUE REALIZA LA FUNCION DE BUSQUEDA DE EQUIPOS POR NOMBRE O NIVEL DE RIESGO(CATEGORIA)
    const { busqueda, handleInputChange } = useSearchBox();

    //FUNCION QUE FILTRA LOS EQUIPOS POR NOMBRE O NIVEL DE RIESGO
    const filtarEquipos = (busqueda) => {
        const equiposBuscar = busqueda.toLowerCase();
        const equiposEncontrados = equiposIniciales.filter(
            (equipo) => {
                equipo.nombre.toLowerCase().includes(equiposBuscar) || equipo.nivelRiesgo.toLowerCase().includes(equiposBuscar)
            })

            console.log(equiposEncontrados);
    
            equiposEncontrados.map((equipo, i) => {  
              return (
                    <div>
                        <h2 key={i}><strong>Nombre: </strong>{equipo.nombre}</h2>
                        <p><strong>Descripcion: </strong>{equipo.descripcion}</p>
                        <p><strong>Nivel de Riesgo: </strong>{equipo.nivelRiesgo}</p>
                        <p><strong>NOM Aplicada: </strong>{equipo.nomAplicada}</p>
                        <ul><strong>Caracteristicas: </strong>
                        {equipo.caracteristicas.map((caracteristica, i) => <li key={i}>{caracteristica}</li>)}
                        </ul>
                        <ul><strong>Mantenimiento Preventivo: </strong>
                        {equipo.mantPreventivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                        </ul>
                        <ul><strong>Mantenimiento Correctivo: </strong>
                        {equipo.mantCorrectivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                        </ul>
                    </div>

                )

            })
    
    }
    return (
        <>
            <Header />
            <main style={{ display: "flex" }}>
                <AsideCategories listaEquipos={listaEquipos} />
                <section>
                    <h1>CATALOGO DE TODOS LOS EQUIPOS</h1>
                    {/*SECCION DE BUSCAR Y AGREGAR EQUIPOS */}
                    <div>
                        <SearchBox busqueda={busqueda} handleInputChange={handleInputChange} />
                        <button>+ Agregar Equipo</button>
                    </div>
                    {/*GRID DE EQUIPOS */}
                    <div>
                        {
                            equiposIniciales.map((equipo, i) => {
                                return (
                                    <div key={i}>
                                        <i><img src={equipo.img} /></i>
                                        <h2><strong>Nombre: </strong>{equipo.nombre}</h2>
                                        <p><strong>Descripcion: </strong>{equipo.descripcion}</p>
                                        <p><strong>Nivel de Riesgo: </strong>{equipo.nivelRiesgo}</p>
                                        <p><strong>NOM Aplicada: </strong>{equipo.nomAplicada}</p>
                                        <ul><strong>Caracteristicas: </strong>
                                            {equipo.caracteristicas.map((caracteristica, i) => <li key={i}>{caracteristica}</li>)}
                                        </ul>
                                        <ul><strong>Mantenimiento Preventivo: </strong>
                                            {equipo.mantPreventivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                                        </ul>
                                        <ul><strong>Mantenimiento Correctivo: </strong>
                                            {equipo.mantCorrectivo.map((mantenimiento, i) => <li key={i}>{mantenimiento}</li>)}
                                        </ul>
                                    </div>

                                )
                            })      

                        }
                    </div>

                </section>
            </main>
            <Footer />
        </>

    )

}

export default TodosEquipos;