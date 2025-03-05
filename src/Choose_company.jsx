import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/choose_company.css';

import DesignImage from './Styles/Design.png';
import PhotographerImage from './Styles/Photographer.png';
import ITImage from './Styles/IT.png';
import FashionImage from './Styles/Fashion.png';
import TheatreImage from './Styles/Movie.png';
import MarketingImage from './Styles/Marketing.png';
import FilterIcon from './Styles/filter.png';
import MagnifyingGlass from './Styles/Found.png';
import DefaultIcon from './Styles/default-icon.png';

const organizations = [
  { id: 1, name: 'Дизайн', image: DesignImage, size: 'first' },
  { id: 2, name: 'Фотография и видеопроизводство', image: PhotographerImage, size: 'second' },
  { id: 3, name: 'IT и цифровое творчество', image: ITImage, size: 'third' },
  { id: 4, name: 'Мода и стиль', image: FashionImage, size: 'forth' },
  { id: 5, name: 'Театр и кино', image: TheatreImage, size: 'fifth' },
  { id: 6, name: 'Реклама и маркетинг', image: MarketingImage, size: 'six' },
];

function ChooseCompany() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCardClick = (orgId, orgName) => {
    if (selectedCard === orgId) {
      setSelectedCard(null);
    } else {
      setSelectedCard(orgId);
    }
    console.log(`Вы выбрали организацию: ${orgName}`);
  };

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://your-backend-api/api/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Если требуется авторизация
          // 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error('Ошибка поиска:', err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (orgId) => {
    console.log(`Переход к организации с ID: ${orgId}`);
    navigate(`/organization/${orgId}`);
    setSearchResults([]);
  };

  const handleCreateOrganization = () => {
    navigate('/create-company');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-results') && !e.target.closest('.search-bar')) {
        setSearchResults([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
      <div className="choose-company">
        <h1 className="title">CastFind</h1>
        <p className="subtitle">
          Выберите организацию, к которой хотите бы присоединиться
        </p>
        <div className="search-section">
          <h3>Попробуйте поиск по названию</h3>
          <div className="search-bar">
          <span className="search-icon">
            <img src={MagnifyingGlass} alt="Magnifying glass" />
          </span>
            <input
                type="text"
                placeholder="Введите запрос..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="filter-btn">
              <img src={FilterIcon} alt="Filter icon" />
            </button>
          </div>
          {isLoading && <div className="loading">Загрузка...</div>}
          {searchResults.length > 0 && !isLoading && (
              <div className="search-results">
                {searchResults.map((result) => (
                    <div
                        key={result.id}
                        className="search-result-item"
                        onClick={() => handleResultClick(result.id)}
                    >
                      <img
                          src={result.icon || DefaultIcon}
                          alt={result.name}
                          className="result-icon"
                      />
                      <div className="result-text">
                        <p className="result-name">{result.name}</p>
                        <p className="result-description">{result.description}</p>
                      </div>
                    </div>
                ))}
              </div>
          )}
          <h3>Или используйте код приглашения</h3>
          <input type="text" placeholder="Введите код приглашения" className="invite-input" />
          <div className="divider"></div>
          <button className="create-btn" onClick={handleCreateOrganization}>
            Создать новую организацию
          </button>
        </div>
        <div className="popular-section">
          <h2>Популярные организации</h2>
          <div className="organization-grid">
            {organizations.map((org) => (
                <button
                    key={org.id}
                    className={`organization-card ${org.size} ${selectedCard === org.id ? 'selected' : ''}`}
                    onClick={() => handleCardClick(org.id, org.name)}
                >
                  <img src={org.image} alt={org.name} />
                  <p className="organization-name">{org.name}</p>
                </button>
            ))}
          </div>
        </div>
        <div className="action-buttons">
          <button className="secondary-btn">Настроить позже</button>
          <button className="primary-btn">Присоединиться</button>
        </div>
      </div>
  );
}

export default ChooseCompany;