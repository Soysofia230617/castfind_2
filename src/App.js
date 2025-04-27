import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/styles.css'; 
import './Styles/fonts.css'; 

const App = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/enterance'); 
    };

    const handleRegister = () => {
       navigate('/register'); 
    };

    return (
        <div className="body_start">
            <div className="container">
                <h1 className="h1">CastFind</h1>
                <h2>Биржа талантов для творческих людей</h2>
                <div className="container-button">
                    <button className="rounded-button green-button" onClick={handleLogin}>Войти</button>
                    <button className="rounded-button transparent-button" onClick={handleRegister}>Зарегистрироваться</button>
                </div>
                <h3>Перед началом работы ознакомьтесь с правилами конфиденциальности.</h3>
                <p id="message"></p>
            </div>
        </div>
    );
};


export default App;
