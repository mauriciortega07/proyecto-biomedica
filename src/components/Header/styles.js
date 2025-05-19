import styled from 'styled-components';

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    padding: 3rem;
    gap: 15%;
    
    

    div {
    transition: transform .2s;
        cursor: pointer;
    
    &:hover {
        
        transform: scale(1.1);
        }
    }
    
`

const UserOptionsContainer = styled.div`
    display: flex;
    width: 38%;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`

export {
    HeaderContainer,
    UserOptionsContainer
}