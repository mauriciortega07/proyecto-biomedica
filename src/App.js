import UserAcces from "./components/UserAcces";
import TodosEquipos from "./components/Equipos/TodosEquipos";
import { Routes, Route } from 'react-router-dom';
import LogoEmpresa from "./utilities/logos/inp-logo.png";
import { ThemeProvider } from "styled-components";
import Theme from "./theme"
import GlobalStyles from "./theme/GlobalStyles";
import getEquiposBiomedicos from "./data/getEquiposBiomedicos";

function App() {
  const equiposBiomedicos = getEquiposBiomedicos();
  //console.log(equiposBiomedicos);
  return (
    <ThemeProvider theme={Theme}>
      <GlobalStyles />      
      <div className="App">
        <Routes>
          <Route path="/" element={<UserAcces logoImg={LogoEmpresa} />} />
          <Route path="/Inicio" element={<TodosEquipos listaEquipos={equiposBiomedicos} />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
