import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/register.css'
import './Styles/fonts.css'

function Register_func() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const maxLength = 12;
  const handlePhoneChange = (event) => {
    const value = event.target.value;
    const filteredValue = value.replace(/[^+\d\s-]/g, '');
    const trimmedValue = filteredValue.substring(0, maxLength);
    setPhone(trimmedValue);
};
  useEffect(() => {
    if (username && phone && password) {
      setIsButtonDisabled(false); 
    } else {
      setIsButtonDisabled(true); 
    }
  }, [username, phone, password]);

  const handleRegister = () => {
    console.log('Имя пользователя:', username);
    console.log('Номер телефона:', phone);
    console.log('Пароль:', password);
    navigate('/choose-profile');
  };

  return (
    <div className='register'>
      <div className="container-reg">
        <div className="form-container">
          <h6 className="header">
            <span className="company-name">CastFind</span>
            <span className="divider">|</span>
            <span className="slogan">
              Биржа талантов для<br />
              творческих индустрий
            </span>
          </h6>
          <div className="form-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Имя пользователя"
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+ 7 (999) 999 99 99"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
          </div>
          <button
            className="button-reg"
            onClick={handleRegister}
            disabled={isButtonDisabled}
            style={{opacity: isButtonDisabled ? 0.5 : 1}}
          >
            Зарегистрироваться
          </button>
        </div>
        <p className="footer-text">Перед началом работы ознакомьтесь с правилами конфиденциальности. </p>
      </div>
    </div>
  );
}

export default Register_func;
