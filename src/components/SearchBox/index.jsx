import { useState } from "react";

const SearchBox = ({busqueda, handleInputChange}) => {

    return (
        <input type="text" name={busqueda} value={busqueda} onChange={handleInputChange} placeholder="Buscar por nombre o nivel de riesgo"/>
    )

}

export default SearchBox;