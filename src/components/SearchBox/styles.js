import styled from "styled-components";

const SearchContainer = styled.input`
   padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 20rem;
  text-align: center;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.6);
    

` 

export{
    SearchContainer
}