import { useState } from "react";
import { useEffect } from "react";

const useGetUserSession = () => {
    const [userSession, setUserSession] = useState(null);

    useEffect(() => {
        const userNameSession = JSON.parse(localStorage.getItem('user_session')) || false;
        if(userNameSession) {
            try {
                setUserSession(userNameSession);
                
            }catch (error){
                console.error("Error al obtener la sesion del usuario", error);
                setUserSession(null);
            }
        }
    }, []);

    return userSession;
}

export default useGetUserSession;