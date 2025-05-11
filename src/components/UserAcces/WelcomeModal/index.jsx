import { use, useEffect, useState } from "react"
import  useGetUserSession  from "../../../hooks/useGetUserSession";
import { Overlay, ModalContainer } from "./styles";


const WelcomeModal = ({show, onClose, userName, Message, MessageOp}) => {
    
    useEffect(() => {
        if(show) {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }
    }, [show, onClose]);

    if(!show) {
        return null;
    }

    return (
        <Overlay show={show}>
            <ModalContainer show={show}>
                <h1>{Message} {userName}!</h1>
                <p>{MessageOp}</p>
            </ModalContainer>
        </Overlay>
    )

}

export default WelcomeModal;