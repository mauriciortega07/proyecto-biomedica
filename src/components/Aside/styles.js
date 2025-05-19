import styled from "styled-components"

const AsideContainer = styled.aside`
    margin: 1rem;
    background-color: #fff;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`

const UnorderListContainer = styled.ul`
    padding: 1rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
`

const EnlaceCategories = styled.a`
  color: #000000;
  //padding: 10px 20px;
    font-size: 16px;
    border: none;
  
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;

    &.activo {
    background-color:rgb(213, 22, 51);
    color: white;
    box-shadow: 0 11px 23px rgb(213, 22, 51 / 0.7);

    }

  &:hover {
    //background-color:rgb(61, 75, 147);
    box-shadow: 0 11px 23px rgb(13 24 113 / 0.4);
  }

  &:focus {
    outline: 2px solid blue;
    background-color: lightblue;  
    }

  &:active {
        transform: scale(0.98);

  }
`


export {
    AsideContainer,
    UnorderListContainer,
    EnlaceCategories
}