import { useState } from 'react';
import Login from './Login';
import Signin from "./Signin";
import  Footer  from '../Footer';
import { HeaderLogin, HeaderLogin_div, HeaderLogin_img, UserAccesMain, 
    UserAccesSection, CreateUserButton } from './styles';
import WelcomeModal from './WelcomeModal';

const UserAcces = ({ logoImg }) => {
    const [signinShow, setSigninShow] = useState(false);

    const ShowSign = () => {
        setSigninShow(true);    
    }

    return (
        <>
            <HeaderLogin>
                <HeaderLogin_div>
                    <HeaderLogin_img src={logoImg} alt="Logotipo de la empresa" />
                </HeaderLogin_div>
            </HeaderLogin>

            <UserAccesMain>
                <UserAccesSection>
                    <Login />
                    
                </UserAccesSection>
                
                <section style={{textAlign: 'center'}}>
                    {
                        signinShow || (
                            <>
                                <p style={{padding:"1rem", fontSize: "20px"}}>¿No tienes un usuario creado?</p>
                                <CreateUserButton className="createAccount" onClick={ShowSign}>Crear usuario</CreateUserButton>
                            </>
                        )
                    }
                    {signinShow && (<Signin />)}
                </section>
            </UserAccesMain>
           
           <Footer logoImg={logoImg}/> 
        </>

    )
}

export default UserAcces