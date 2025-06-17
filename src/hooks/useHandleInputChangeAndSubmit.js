import React, { useState } from "react";
import WelcomeModal from "../components/UserAcces/WelcomeModal";
import { useNavigate } from "react-router-dom";

const useHandleInputChangeAndSubmit = () => {
    const [form, setForm] = useState({
        name: "",
        idempleado: "",
        rolempleado: "",
        //email: "",
        password: "",
    })

    const [showModal, setShowModal] = useState(false);
    const [userName, setUserName] = useState("");

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form, [name]: value
        });
    }

    const handleSubmitSigning = (e) => {
        e.preventDefault();

        const { name, idempleado, rolempleado, /*email ,*/ password } = form;
        const Users = JSON.parse(localStorage.getItem("users") || "[]");
        const isUserRegistered = Users.find((user) => user.idempleado === idempleado);

        if (isUserRegistered) {
            alert("El usuario ya existe, por favor inicia sesion");
            setForm({
                name: "",
                idempleado: "",
                rolempleado: "",
                //email: "",
                password: "",  
            })
            navigate("/");
        } else {
            Users.push({
                name: name,
                idempleado: idempleado,
                rolempleado: rolempleado,
                //email: email,
                password: password
            });


            localStorage.setItem("users", JSON.stringify(Users));
            localStorage.setItem("user_session", JSON.stringify({
                name: name,
                idempleado: idempleado,
                rolempleado: rolempleado,
                //email: email,
                password: password
            }));
            setUserName(name);
            setShowModal(true);
            setTimeout(() => navigate("/Inicio"), 3000);

        }
    }

    const handleSubmitLogin = (e) => {
        e.preventDefault();

        const { idempleado, password } = form;
        const Users = JSON.parse(localStorage.getItem("users") || "[]")

        const validUsers = Users.find((user) => user.idempleado === idempleado && user.password === password)

        if (!validUsers) {
            alert("Usuario y/o contraseña incorrectaos. Ingresa nuevamente");
            setForm({
                idempleado: "",
                password: "",  
            })  
        } else {
            //alert("Bienvenido " + validUsers.name); 
            //const modal = (<WelcomeModal />);
            localStorage.setItem("user_session", JSON.stringify(validUsers));
            setUserName(validUsers.name);
            setShowModal(true);
            setTimeout(() => navigate("/Inicio"), 3000);



        }
    }

    return { form, handleInputChange, handleSubmitSigning, handleSubmitLogin,showModal,setShowModal ,userName}

}

export default useHandleInputChangeAndSubmit;