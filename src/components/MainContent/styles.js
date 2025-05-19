import styled from "styled-components";

const MainContainer = styled.main`
    display: flex;
    flex-direction: column;
`

const ContainerEquipos = styled.section`
    flex-direction: column;
    display: flex;
    margin: 1rem 2rem;
    gap: 1rem;
    /* width: 38%; */
    justify-content: space-between;
    align-items: center;
    background-color: #def8ff;
    border-radius: 10px;
    padding: 1rem;
    box-sizing: border-box;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
`

const TitleCatalogo = styled.h1`
    font-size: 20px;
    margin: 1rem;
    padding: 1rem;
    box-sizing: border-box;
    text-align: center;
`

const SearchContainer = styled.div `
    display: flex;
    gap: 1rem;
`

const ButtonRegister = styled.button`
  background-color: #566de6;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color:rgb(61, 75, 147);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }

`

export {
    ContainerEquipos,
    MainContainer,
    TitleCatalogo,
    SearchContainer,
    ButtonRegister
}