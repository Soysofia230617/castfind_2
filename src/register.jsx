import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/enterance.css';
import './Styles/fonts.css';

function Enterance_func() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [number, setNumber] = useState(''); // Новое поле для номера
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(!username || !password || !number);
  }, [username, password, number]);

  const handleRegister = async () => {
    setError('');

    try {
      const registerResponse = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: username.trim(),
          password: password.trim(),
          role: 'ADMIN',
          number: number.trim()
        })
      });

      if (!registerResponse.ok) {
        const errorData = await registerResponse.json().catch(() => ({}));
        console.error('Ошибка сервера:', errorData);
        throw new Error(errorData.message || `Ошибка регистрации: ${registerResponse.status}`);
      }

      const registerData = await registerResponse.json();
      console.log('Ответ сервера на регистрацию:', registerData);

      // Сохраняем токен
      const token = registerData.token;
      localStorage.setItem('jwtToken', token);

      // Шаг 2: Получаем userId через GET /user/info
      const userResponse = await fetch('/user/info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка получения данных пользователя: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      console.log('Данные пользователя:', userData);

      const userId = userData.id;
      if (userId === undefined || userId === null) {
        throw new Error('Не удалось извлечь userId из данных пользователя.');
      }
      localStorage.setItem('userId', userId);

      navigate('/choose-profile');

    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message || "Ошибка регистрации. Проверьте данные и попробуйте снова.");
    }
  };

  const handlePassword = () => {
    console.log('Имя пользователя:', username);
    console.log('Пароль:', password);
    console.log('Номер:', number);
  };

  return (
      <div className="enterance">
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
            <div className="form-group-ent">
              <input
                  type="text"
                  id="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Номер"
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                className="button-ent"
                onClick={handleRegister}
                disabled={isButtonDisabled}
                style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
            >
              Зарегистрироваться
            </button>
            <button className="password" onClick={handlePassword}>
              Забыли пароль?
            </button>
          </div>
          <p className="footer-text-ent">
            Перед началом работы ознакомьтесь с правилами конфиденциальности.
          </p>
        </div>
      </div>
  );
}

export default Enterance_func;