import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Styles/choose.css';
import './Styles/fonts.css';

const ChooseProfile = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate(); 

  const handleProfileClick = (profile) => {
    setSelectedProfile(profile);
  };

  const handleSelect = () => {
    if (selectedProfile === 'manager') {
      navigate('/company');
    } else if (selectedProfile === 'talent') {
      console.log('Выбран профиль Талант');
    }
  };

  const handleSkip = () => {
    console.log('Настроить позже');
  };

  return (
    <div className="choose_page">
      <div className="container_choose">
        <h4>CastFind</h4>
        <h5>Выберите основу для своего профиля. Далее вы сможете изменить выбор или создать второй.</h5>
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