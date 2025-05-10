import styled from "styled-components";

const SigninContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
   
    padding: 1rem;
`

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
`

const FormElement = styled.div `
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-between;
`

const FormButton = styled.button`
    background: aqua;
    border: none;
    width: 40%;
    height: 2rem;
    border-radius: 50px;
    transition: all .20s ease-in;
    cursor: pointer;

    &:hover{
        background:rgb(216, 233, 239);
        transform: scale(1.1);
        
    }
`

export {
    SigninContainer,
    FormContainer,
    FormElement,
    FormButton
}