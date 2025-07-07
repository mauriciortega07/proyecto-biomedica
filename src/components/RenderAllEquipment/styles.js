import styled from "styled-components"


const GridEquipos = styled.article`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50%, 1fr));
    column-gap: 2rem;
    row-gap: 2rem;
    margin: 1rem;
    padding: 1rem;    
    box-sizing: border-box;
    width: 100%;
    height: 50rem;
    overflow-y: scroll;

`

const ContainerMsgNotFound = styled.div`
    padding: 4rem;
    box-sizing: border-box;
`

const CardEquipos = styled.section`
    justify-content: space-between;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    padding: 1rem;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
`

const CardEquiposImgContainer = styled.div`
    display: flex;
    align-items: center;
    width: 50%;
    
`

const SectionInfoEquipos = styled.section`
//width: 40%;


  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  margin: 1rem auto;
  font-family: 'Segoe UI', sans-serif;

  dt {
    font-weight: 600;
    color: #333;
    margin-top: 2rem;

    svg {
      margin-right: 0.5rem;
    }
  }

  dd {
    margin-left: 0;
    color: #555;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
  }

`

const ButtonEdit = styled.button`
    background-color:rgb(99, 107, 195);
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

const ButtonDelete = styled.button`
    background-color:rgb(235, 59, 59);
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;

     &:hover {
    background-color:rgb(182, 0, 0);
    box-shadow: 0 4px 10px rgb(177, 0, 0);
  }

  &:active {
    transform: scale(0.98);
  }

`

export {
    GridEquipos,
    CardEquipos,
    ContainerMsgNotFound,
    CardEquiposImgContainer,
    SectionInfoEquipos,
    ButtonEdit,
    ButtonDelete
}