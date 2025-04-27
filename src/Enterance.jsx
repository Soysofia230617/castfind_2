import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/enterance.css';
import './Styles/fonts.css';

function Enterance_func() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setIsButtonDisabled(!username || !password); // Кнопка активна, если поля заполнены
  }, [username, password]);

  const handleLogin = async () => {
    setError('');

    try {
      const loginResponse = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: username.trim(),
          password: password.trim()
        })
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        console.error('Ошибка сервера:', errorData);
        throw new Error(errorData.message || `Ошибка входа: ${loginResponse.status}`);
      }

      const loginData = await loginResponse.json();
      console.log('Ответ сервера на вход:', loginData);

      const token = loginData.token;
      localStorage.setItem('jwtToken', token);

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
      const role = userData.role;
      if (userId === undefined || userId === null) {
        throw new Error('Не удалось извлечь userId из данных пользователя.');
      }
      if (!role) {
        throw new Error('Не удалось извлечь роль пользователя.');
      }
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', role);

      if (role === 'ADMIN') {
        navigate('/company');
      } else if (role === 'MANAGER') {
        navigate('/company');
      } else if (role === 'TALENT') {
        navigate('/talent-profile');
      } else {
        throw new Error('Неизвестная роль пользователя.');
      }

    } catch (err) {
      console.error("Ошибка:", err);
      setError(err.message || "Ошибка входа. Проверьте данные и попробуйте снова.");
    }
  };

  const handlePassword = () => {
    console.log('Имя пользователя:', username);
    console.log('Пароль:', password);
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button
                className="button-ent"
                onClick={handleLogin}
                disabled={isButtonDisabled}
                style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
            >
              Войти
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