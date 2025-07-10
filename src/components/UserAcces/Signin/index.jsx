import React from "react";
import useHandleInputChangeAndSubmit from "../../../hooks/useHandleInputChangeAndSubmit";
import {SigninContainer, FormContainer, FormElement, FormButton} from "./styles";
import WelcomeModal from "../WelcomeModal";


const Signin = () => {

    const { 
        form, 
        handleInputChange, 
        handleSubmitSigning, 
        showModal,      
        setShowModal,
        userName
    } = useHandleInputChangeAndSubmit();

    return (
        <SigninContainer className="signinContainer">
            <WelcomeModal show={showModal} onClose={() => setShowModal(false) } userName={userName} Message={"Registro Exitoso"} MessageOp={"Cargando catalogo..."} />
            <h1 style={{textAlign:'center', fontSize:"20px"}}>REGISTRARSE</h1>
            <FormContainer onSubmit={handleSubmitSigning}>
                <FormElement>
                    <label for="name">Nombre Completo: </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="ingresa tu nombre completo"
                        required
                    />
                </FormElement>

                <FormElement>
                    <label for="idempleado">numero de trabajador: </label>
                    <input
                        id="idempleado"
                        type="text"
                        name="idempleado"
                        placeholder="ingresa tu numero de trabajador"
                        value={form.idempleado}
                        onChange={(e) => handleInputChange(e)}
                        required
                    />
                </FormElement>

                <FormElement>
                    <label for="rolempleado">rol: </label>
                    <input
                        id="rolempleado"
                        type="text"
                        value={form.rolempleado}
                        onChange={(e) => handleInputChange(e)}
                        placeholder="ingresa tu rol de trabajador"
                        required
                        name="rolempleado"
                    />
                </FormElement>

                <FormElement>
                    <label for="password">contraseña</label>
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

                <FormButton type="submit"> Registrarse </FormButton>
            </FormContainer>
        </SigninContainer>
    )
}

export default Signin;