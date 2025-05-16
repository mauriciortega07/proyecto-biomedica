import { useState } from "react";
import { SearchContainer } from "./styles";

const SearchBox = ({busqueda, handleInputChange}) => {

    return (
        <SearchContainer type="text" name={busqueda} value={busqueda} onChange={handleInputChange} placeholder="Buscar por nombre o nivel de riesgo"/>
    )

}

export default SearchBox;