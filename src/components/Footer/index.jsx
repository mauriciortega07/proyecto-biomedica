import React from 'react';
import { FooterContainer } from './styles.js';

const Footer = () => {
    return (
        <FooterContainer>
            <div style={{alignContent: 'center', textAlign: 'center'}}>
                <ul>
                    <li><a href="https://www.pediatria.gob.mx/">Acerca del INP</a></li>
                </ul>
            </div>
        </FooterContainer>
    )
}

export default Footer;