import {createGlobalStyle} from 'styled-components';
import reset from "styled-reset"    

const GlobalStyles = createGlobalStyle`
    ${reset}

    header, footer {
    background-color: ${props => props.theme.color.headerColor}
    }

    main {
    background-color: ${props => props.theme.color.mainColor}
    }

    body, header, main, footer {
    font-family: ${props => props.theme.fonts.base}
    }

    a {
    text-decoration: none;
    }
`

export default GlobalStyles;