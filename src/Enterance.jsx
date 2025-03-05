import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/enterance.css'
import './Styles/fonts.css'

function Enterance_func() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
  const [error, setError] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    if (username && password) {
      setIsButtonDisabled(false); 
    } else {
      setIsButtonDisabled(true); 
    }
  }, [username, password]);

  const handleRegister = async () => {
    setError(''); 

    try {
      const response = await fetch('http://your-backend-api/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при входе');
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('jwtToken', data.token);
        console.log('JWT-токен сохранён:', data.token);

        navigate('/choose-profile');
      } else {
        throw new Error('Токен не получен от сервера');
      }
    } catch (err) {
      console.error('Ошибка:', err.message);
      setError('Неверный логин или пароль. Попробуйте снова.');
    }
  };

  const handlePassword = () => {
    console.log('Имя пользователя:', username);
    console.log('Пароль:', password);
  };

  return (
    <div className='enterance'>
      <div className="container-ent">
        <div className="enterance-container">
          <h6 className="header_enterance">
            <span className="company-name">CastFind</span> 
            <span className="divider">|</span>
            <span className="slogan">
              Биржа талантов для<br />
              творческих индустрий
            </span>
          </h6>
          <div className="form-group-ent">
            <input
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Имя пользователя" 
            />
          </div>
          <div className="form-group-ent">
            <input
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Пароль" 
            />
          </div>
          <button 
            className="button-ent" 
            onClick={handleRegister} 
            disabled={isButtonDisabled}
            style={{opacity: isButtonDisabled ? 0.5 : 1}} 
          >
            Войти
          </button>
          <button className="password" onClick={handlePassword}>Забыли пароль?</button>
        </div>
        <p className="footer-text-ent">Перед началом работы ознакомьтесь с правилами конфиденциальности. </p>
      </div>
    </div>
  );
}

export default Enterance_func;
