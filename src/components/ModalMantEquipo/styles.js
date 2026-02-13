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

const SubTitle = styled.p`
    margin: -1.2rem 0 1.3rem 0;
    color: #666;
    font-style: italic;
    font-size: 0.95rem;
`

const ModalContent = styled.div`
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    width: 760px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    margin: 2rem;
    box-sizing: border-box;
    box-shadow: 0 6px 15px rgb(203 0 0 / 78%);;

`

const TabsContainer = styled.div`
    display: flex;
    gap: 10px;
    margin: 0.5rem 0 1.2rem 0;
    flex-wrap: wrap;
`

const TabButton = styled.button`
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    border: 1px solid #ddd;
    padding: 10px 14px;
    cursor: pointer;
    font-weight: 700;
    background: ${(p) => (p.$active ? "rgb(206, 59, 211)" : "#fff")};
    color: ${(p) => (p.$active ? "#fff" : "#333")};
    transition: transform 0.15s ease, box-shadow 0.15s ease;

    &:hover {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        transform: translateY(-1px);
    }
`

const SectionCard = styled.section`
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 1rem;
    background: #fafafa;
    margin: 1rem 0;
`

const SectionTitle = styled.h3`
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 800;
    display: flex;
    align-items: center;
`

const TwoCols = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
`

const ErrorBox = styled.div`
    border: 1px solid #ffb4b4;
    background: #fff0f0;
    color: #b00020;
    border-radius: 10px;
    padding: 10px 12px;
    margin: 0 0 1rem 0;
    font-weight: 700;
`

const HistoryContainer = styled.div`
    margin-top: 0.5rem;
`

const HistoryItem = styled.div`
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    background: #fff;
    margin: 10px 0;
`

const Badge = styled.span`
    display: inline-block;
    padding: 6px 10px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 0.82rem;
    border: 1px solid #ddd;
    background: ${(p) =>
        p.$tipo === "PREVENTIVO"
            ? "#eaf7ff"
            : p.$tipo === "CORRECTIVO"
            ? "#fff4e6"
            : "#f3e8ff"};
`

const EmptyState = styled.div`
    border: 1px dashed #ddd;
    border-radius: 12px;
    padding: 16px;
    color: #666;
    text-align: center;
    background: #fff;
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
    height: 8rem;
`

const ButtonSaveEquipment = styled.button`
    background-color:rgb(206, 59, 211);
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;

     &:hover {
    background-color:rgb(31 224 142);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }


`

const ButtonCancelled = styled.button`
    background-color:rgb(206, 59, 211);
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s, box-shadow 0.3s;

     &:hover {
    background-color:rgb(31 224 142);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    color: white;
  }

  &:active {
    transform: scale(0.98);
  }
`

const ButtonsContainer = styled.div`
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    justify-content: space-around;
`

const TagsContainer = styled.dt`
    display: flex;
    align-items: anchor-center;
    margin: 10px 0px;
`

export {
  ModalBackground,
  ModalContent,
  FormField,
  TextArea,
  TitleModal,
  SubTitle,
  ButtonSaveEquipment,
  ButtonCancelled,
  ButtonsContainer,
  TagsContainer,
  TabsContainer,
  TabButton,
  SectionCard,
  SectionTitle,
  TwoCols,
  ErrorBox,
  HistoryContainer,
  HistoryItem,
  Badge,
  EmptyState

}