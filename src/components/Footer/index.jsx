import React from 'react';
import { FooterContainer, ImgContainer } from './styles.js';
import logoImg from '../../utilities/logos/Ibiomedico.png'

const Footer = () => {
    return (
        <FooterContainer>
            <div style={{ alignContent: 'center', textAlign: 'center' }}>
                
            </div>
            <ImgContainer src={logoImg} />

        </FooterContainer>
    )
}

export default Footer;