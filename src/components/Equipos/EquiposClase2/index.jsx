import Footer from "../../Footer";
import Header from "../../Header";
import MainContent from "../../MainContent";

const EquiposClase2 = ({equiposBiomedicos}) => {
return (

<>
            <Header />
            <MainContent equiposBiomedicos={equiposBiomedicos} />
            <Footer />
        </>    
)

}

export default EquiposClase2;