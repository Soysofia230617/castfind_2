import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/choose.css';
import './Styles/fonts.css';

const ChooseProfile = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
    setError('');
  };

  const handleSelect = async () => {
    if (!selectedProfile) {
      setError('Пожалуйста, выберите профиль');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('Токен не найден. Пожалуйста, войдите снова.');
      }

      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('userId не найден. Пожалуйста, войдите снова.');
      }

      const role = selectedProfile.toUpperCase();

      const response = await fetch('/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: role,
          userId: parseInt(userId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Роль сохранена на сервере:', data);

      if (data.result) {
        if (selectedProfile === 'manager') {
          navigate('/company');
        } else if (selectedProfile === 'talent') {
          navigate('/talent-profile');
        }
      } else {
        setError(data.error || 'Не удалось сохранить роль.');
      }
    } catch (err) {
      console.error('Ошибка:', err.message);
      setError(err.message || 'Не удалось сохранить выбор. Попробуйте снова.');
    }
  };

  const handleSkip = () => {
    console.log('Настроить позже');
    // navigate('/some-default-page');
  };

  return (
      <div className="choose_page">
        <div className="container_choose">
          <h4>CastFind</h4>
          <h5>Выберите основу для своего профиля. Далее вы сможете изменить выбор или создать второй.</h5>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="container-button-choose">
            <button
                className={`rounded-button-choose choose ${selectedProfile === 'manager' ? 'selected' : ''}`}
                id="manager"
                onClick={() => handleProfileClick('manager')}
            >
              Менеджер
            </button>
            <button
                className={`rounded-button-choose choose ${selectedProfile === 'talent' ? 'selected' : ''}`}
                id="talent"
                onClick={() => handleProfileClick('talent')}
            >
              Талант
            </button>
            <div className="spacer"></div>
            <button
                className="rounded-button-choose next"
                id="next"
                onClick={handleSkip}
            >
              Настроить позже
            </button>
            <button
                className="rounded-button-choose green-button-choose"
                id="selectButton"
                disabled={!selectedProfile}
                onClick={handleSelect}
            >
              Выбрать
            </button>
          </div>
        </div>
      </div>
  );
};

export default ChooseProfile;