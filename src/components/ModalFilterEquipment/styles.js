import styled from "styled-components";

const ModalBackground = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0; 
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5)



`

const TitleModal = styled.h2`
    margin: 2rem 0rem;
    font-weight: 600;
    font-size: clamp(10px, 2vw, 3rem);

`

const ModalContent = styled.div`
background: #fff;
padding: 2rem;
border-radius: 8px;
width: 600px;
max-width: 90%;
max-height: 90vh;
overflow-y: auto;
margin: 2rem;
box-sizing: border-box;
box-shadow: 0 4px 10px rgb(0 36 255 / 0.5);

`

const FormField = styled.input`
    width: 100%;
    padding: 0.5rem;
    margin: 1rem 0rem;
    box-sizing: border-box;
    font-family: Raleway,Poppins,monseratt,sans-serif;
`

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.5rem;
    margin: 1rem 0rem;
    box-sizing: border-box;
    font-family: Raleway,Poppins,monseratt,sans-serif;
`

const ButtonStartEquipment = styled.button`
    background-color:rgb(211, 59, 87);
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;

     &:disabled {
    background-color:rgba(161, 161, 161, 0.3);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }


`
export {
    ModalBackground,
    ModalContent,
    FormField,
    TextArea,
    TitleModal,
    ButtonStartEquipment
    
}