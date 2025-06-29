import Header from "../../Header";
import Footer from "../../Footer";
import MainContent from "../../MainContent";


const TodosEquipos = ({equiposBiomedicos, setEquiposBiomedicos, error, cargando, }) => {
 
    

    return (
        <>
            <Header />
            <MainContent equiposBiomedicos={equiposBiomedicos} setEquiposBiomedicos={setEquiposBiomedicos} error={error} cargando={cargando}/>
            <Footer/>
        </>

    )

}

export default TodosEquipos;