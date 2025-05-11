import { useState } from "react"

const useSearchBox = () => {
const [busqueda, setBusqueda] = useState("");

const handleInputChange = (e) => {
        setBusqueda(e.target.value)
        console.log(busqueda);
    }

    return {
        busqueda,
        handleInputChange
    }

}

export default useSearchBox
