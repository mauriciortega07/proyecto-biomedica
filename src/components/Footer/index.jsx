import React from 'react';
import { FooterContainer, ImgContainer } from './styles.js';
import logoImg from '../../utilities/logos/inp-logo.png'

const Footer = () => {
    return (
        <FooterContainer>
            <div style={{ alignContent: 'center', textAlign: 'center' }}>
                <ul>
                    <li><a href="https://www.pediatria.gob.mx/">Acerca del INP</a></li>
                </ul>
            </div>
            <ImgContainer src={logoImg} />

        </FooterContainer>
    )
}

export default Footer;