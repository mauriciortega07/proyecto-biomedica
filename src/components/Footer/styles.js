import styled from 'styled-components';

const FooterContainer = styled.footer`
    display: flex;
    padding: 1vw;
    justify-content: center;
    gap: 5vw; 
    height: 4vw;
`

const ImgContainer = styled.img `
    transition: transform .2s;
    cursor: pointer;
    width: 8rem;
    //height: 10%;

    &:hover {
        transform: scale(1.1);
        
    }

`
     

export {
    FooterContainer,
    ImgContainer
}

