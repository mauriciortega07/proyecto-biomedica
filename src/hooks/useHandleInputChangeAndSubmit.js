import React, { useState } from "react";
import WelcomeModal from "../components/UserAcces/WelcomeModal";
import { useNavigate } from "react-router-dom";

const API_URL = "/api";

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

    const handleSubmitSigning = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Error al registrarse");
                return;
            }

            localStorage.setItem("user_session", JSON.stringify(data.user));
            setUserName(data.user.name);
            setShowModal(true);
            setTimeout(() => navigate("/Inicio"), 3000);
        } catch (error) {
            console.error("Error al registrarse", error);
            alert("Error en el registro");
        }
    };


    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://54.226.35.178:4000/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    idempleado: form.idempleado,
                    password: form.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Usuario o contraseña incorrectos");
                return;
            }

            localStorage.setItem("user_session", JSON.stringify(data.user));
            setUserName(data.user.name);
            setShowModal(true);
            setTimeout(() => navigate("/Inicio"), 3000);
        } catch (error) {
            console.error("Error al iniciar sesión", error);
            alert("Error en el inicio de sesión");
        }
    };


    return { form, handleInputChange, handleSubmitSigning, handleSubmitLogin, showModal, setShowModal, userName }

}

export default useHandleInputChangeAndSubmit;