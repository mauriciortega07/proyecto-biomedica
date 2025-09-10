import { useEffect, useState } from "react";
import {
    ModalBackground,
    ModalContent,
    TitleModal,
    ButtonSaveEquipment,
    ButtonCancelled,
    ButtonsContainer
} from './styles'

const API_URL = "/api";

const ModalDeleteEquipment = ({ equipoAEliminar, setModalDeleteEquipment, equiposIniciales, setEquiposIniciales }) => {
    const [confirmar, setConfirmar] = useState(false);
    const [error, setError] = useState(null);

  
    const handleDeleteEquipment = async () => {
        try {
            const response = await fetch(`${API_URL}/equipos_biomedicos/${equipoAEliminar.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el equipo de la base de datos");
            }

            //eliminar del estado local si la respuesta fue exitosa
            const nuevaLista = equiposIniciales.filter(equipo => equipo.id !== equipoAEliminar.id);
            setEquiposIniciales(nuevaLista);
            setConfirmar(true);

        } catch (error) {
            console.error("Error al eliminar el equipo de la base de datos: ", error);
        }
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
                
                {error && <p>{error}</p>}

                {!confirmar && !error ? (
                    <>
                        <p>¿Estás seguro que deseas eliminar: <strong>{equipoAEliminar.nombre}</strong>?</p>
                        <ButtonsContainer>
                            <ButtonCancelled onClick={() => setModalDeleteEquipment(false)}>Cancelar</ButtonCancelled>
                            <ButtonSaveEquipment onClick={handleDeleteEquipment}>Eliminar</ButtonSaveEquipment>
                        </ButtonsContainer>
                    </>

                ) : null}

                {confirmar && !error && (
                    <p>Equipo eliminado correctamente</p>
                )}
            </ModalContent>
        </ModalBackground >
    )
}

export default ModalDeleteEquipment;