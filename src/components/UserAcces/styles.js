import styled from 'styled-components';
const HeaderLogin = styled.header`
    text-align: center;
    padding: 2rem;`

const HeaderLogin_div = styled.div`
    width: 20%;
    margin: auto;
    transition: transform .2s;
    cursor: pointer;
     
    &:hover {
        
        transform: scale(1.1);
        }
    
`

const HeaderLogin_img = styled.img`
    width: 100%;

`

const UserAccesMain = styled.main`
    display: flex;    
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    padding: 3rem;
    gap: 5rem;
    justify-content: center;
`

const UserAccesSection = styled.section`
    display: flex;
`

const CreateUserButton = styled.button`
    background: #eb49a1;
    border: none;
    width: 8rem;
    height: 2rem;
    border-radius: 50px;
    transition: all .20s ease-in;
    cursor: pointer;
    color: white;

    &:hover{
        background:rgb(116, 200, 230);
        transform: scale(1.1);
        color: black;
        
    }
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
    HeaderLogin,
    HeaderLogin_div,
    HeaderLogin_img,
    UserAccesMain,
    UserAccesSection,
    CreateUserButton
}