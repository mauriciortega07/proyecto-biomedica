import Header from "../../Header";
import Footer from "../../Footer";
import MainContent from "../../MainContent";


const TodosEquipos = ({equiposBiomedicos}) => {
 
    

    return (
        <>
            <Header />
            <MainContent equiposBiomedicos={equiposBiomedicos} />
            <Footer/>
        </>

    )

}

export default TodosEquipos;