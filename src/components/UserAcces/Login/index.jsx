import React from "react";
import useHandleInputChangeAndSubmit from "../../../hooks/useHandleInputChangeAndSubmit";
import {LoginContainer, FormContainer, FormElement, FormButton} from "./styles";
import WelcomeModal from "../WelcomeModal";

const Login = () => {

    const {
        form, 
        handleInputChange,
        handleSubmitLogin,
        showModal,      
        setShowModal,
        userName
    } = useHandleInputChangeAndSubmit()

    return (
        <LoginContainer className="loginContainer">
            <WelcomeModal show={showModal} onClose={() => setShowModal(false)} userName={userName} Message={"Bienvenido"} MessageOp={"Cargando catalogo..."}/>
            <h1 style={{textAlign:'center', fontSize:"20px"}}>INICIAR SESION</h1>
            <FormContainer onSubmit={handleSubmitLogin}>
                <FormElement>
                    <label for = "idempleado">ID De Empleado: </label>
                    <input 
                    id="idempleado" 
                    type="text"
                    name="idempleado" 
                    placeholder="ingresa tu id de empleado"
                    value={form.idempleado}
                    onChange={(e) => handleInputChange(e)}
                    required
                    />
                </FormElement>
            
                <FormElement>
                    <label for = "password">Contraseña: </label>
                    <input 
                    id="password"
                    type="password"
                    name="password"
                    placeholder="ingresa tu contraseña"
                    value={form.password}
                    onChange={(e) => handleInputChange(e)}
                    required
                    />
                </FormElement>

                <FormButton type="submit"> Iniciar Sesion </FormButton>
                
                
            </FormContainer>
        </LoginContainer>
    )
}

export default Login;