import iconUser from '../../utilities/icons/user (1).svg';
import iconSignout from '../../utilities/icons/sign-out_6461685.png';
import inpLogo from '../../utilities/logos/Ibiomedico.png';
import { useNavigate } from 'react-router-dom'; 
import { HeaderContainer, UserOptionsContainer } from './styles';

const Header = () => {
const navigate = useNavigate();


const getUserSession = () => {
    const userSession = JSON.parse(localStorage.getItem('user_session')) || [];
    console.log(userSession)
    
    if(userSession) {
        return (
            <UserOptionsContainer>
                <i style={{width:"5%"}}><img alt='IconoDeUsuario' style={{width:"100%"}} src={(iconUser)}></img></i>
                <h1 style={{fontSize:"clamp(1vw, 1rem, 2vw)"}}>{userSession.name}</h1>
                <i style={{width:"11%", cursor:"pointer"}}><img alt='IconoDeCerrarSesion' style={{width:"100%"}} src={(iconSignout)} onClick={(handleSignOut)}></img></i>
            </UserOptionsContainer>
        )
    }
} 

const handleSignOut = () => {
    const userSession = JSON.parse(localStorage.getItem('user_session')) || [];
    if(userSession) {
        localStorage.removeItem('user_session');
        ;
        navigate("/")
    }

}

/*const userSession = getUserSession();*/

return (
    <HeaderContainer>
        <div style={{width:'15em'}}>
            <img src={(inpLogo)} style={{width:'7em'}}></img>
        </div>
        {getUserSession()}
    </HeaderContainer>
)
}

export default Header;