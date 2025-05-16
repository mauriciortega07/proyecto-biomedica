import { useEffect, useState } from "react";
import {ModalBackground,
    ModalContent,
    TitleModal,
    ButtonSaveEquipment,
    ButtonCancelled,
    ButtonsContainer} from './styles'

const ModalDeleteEquipment = ({ equipoAEliminar, setModalDeleteEquipment, equiposIniciales, setEquiposIniciales }) => {
    const [confirmar, setConfirmar] = useState(false);

    const handleDeleteEquipment = () => {
        const nuevaLista = equiposIniciales.filter(equipo => equipo !== equipoAEliminar);
        setEquiposIniciales(nuevaLista);
        setConfirmar(true);
    };

    useEffect(() => {
        if (confirmar) {
            const timer = setTimeout(() => {
                setModalDeleteEquipment(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [confirmar, setModalDeleteEquipment]);

    return (

        <ModalBackground>
            <ModalContent>
                <TitleModal>Eliminar Equipo</TitleModal>
                {!confirmar ? (
                    <>
                        <p>¿Estás seguro que deseas eliminar: <strong>{equipoAEliminar.nombre}</strong>?</p>
                        <ButtonsContainer>
                            <ButtonCancelled onClick={() => setModalDeleteEquipment(false)}>Cancelar</ButtonCancelled>
                            <ButtonSaveEquipment onClick={handleDeleteEquipment}>Eliminar</ButtonSaveEquipment>
                        </ButtonsContainer>
                    </>
                ) : (
                    <p>✅ Equipo eliminado correctamente</p>
                )}
            </ModalContent>
        </ModalBackground >
    )
}

export default ModalDeleteEquipment;