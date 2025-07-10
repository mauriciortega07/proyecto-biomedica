import UserAcces from "./components/UserAcces";
import TodosEquipos from "./components/Equipos/TodosEquipos";
import { Routes, Route } from 'react-router-dom';
import LogoEmpresa from "./utilities/logos/Ibiomedico.png";
import { ThemeProvider } from "styled-components";
import Theme from "./theme"
import GlobalStyles from "./theme/GlobalStyles";
import { useEffect, useState } from "react";
import useEquiposBiomedicos from "./data/useEquiposBiomedicos";

function App() {
  const { equiposBiomedicos, setEquiposBiomedicos, cargando, error } = useEquiposBiomedicos();

  return (
      <ThemeProvider theme={Theme}>
        <GlobalStyles />
        <div className="App" style={{ display: "grid", minHeight: "100dvh", gridTemplateRows: "auto 1fr auto" }}>
          <Routes>
            <Route path="/" element={<UserAcces logoImg={LogoEmpresa} />} />
            <Route path="/Inicio" element={<TodosEquipos equiposBiomedicos={equiposBiomedicos} setEquiposBiomedicos={setEquiposBiomedicos} cargando ={cargando} error={error}/>} />


          </Routes>
        </div>
      </ThemeProvider>
    );
}

export default App;
