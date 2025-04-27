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
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Получаем роль и userId пользователя при загрузке страницы
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Токен не найден. Пожалуйста, войдите снова.');
        }

        const response = await fetch('/user/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Ошибка получения данных пользователя: ${response.status}`);
        }

        const userData = await response.json();
        console.log('Данные пользователя:', userData);

        const role = userData.role;
        const id = userData.id;
        if (!role) {
          throw new Error('Не удалось извлечь роль пользователя.');
        }
        if (id === undefined || id === null) {
          throw new Error('Не удалось извлечь userId пользователя.');
        }
        setUserRole(role);
        setUserId(id);
      } catch (err) {
        console.error('Ошибка:', err);
        setError(err.message || 'Ошибка загрузки данных пользователя.');
        navigate('/enterance');
      }
    };

    fetchUserData();
  }, [navigate]);

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
      if (!userId) {
        throw new Error('userId не найден. Пожалуйста, войдите снова.');
      }

      console.log('Запрос организаций для userId:', userId);

      const BASE_URL = 'http://localhost:3000';
      let response = await fetch(`/organization/all/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        console.log(`Эндпоинт /organization/all/${userId} вернул ошибку: ${response.status}`);
        if (response.status === 404) {
          // Если 404, считаем, что организаций нет, и возвращаем пустой массив
          console.log('Организаций не найдено, возвращаем пустой массив.');
          setSearchResults([]);
          setIsLoading(false);
          return;
        }

        // TODO: Уточнить у бэкенда, есть ли такой эндпоинт
        response = await fetch(`/organization/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          console.log(`Эндпоинт /organization/all вернул ошибку: ${response.status}`);
          console.log('Используем статические данные для поиска...');
          const filteredResults = organizations.filter((org) =>
              org.name.toLowerCase().includes(query.toLowerCase())
          );
          const formattedResults = filteredResults.map((org) => ({
            id: org.id,
            name: org.name,
            description: org.description || 'Нет описания',
            icon: org.image,
          }));
          setSearchResults(formattedResults);
          setIsLoading(false);
          return;
        }
      }

      const data = await response.json();
      console.log('Данные организаций:', data);

      if (!data.organizationResponses) {
        console.log('Поле organizationResponses отсутствует, возвращаем пустой массив.');
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      // TODO: Желательно перенести фильтрацию на бэкенд (например, GET /organization/search?query=...)
      const filteredResults = data.organizationResponses.filter((org) =>
          org.name.toLowerCase().includes(query.toLowerCase())
      );

      const formattedResults = filteredResults.map((org) => ({
        id: org.id,
        name: org.name,
        description: org.description || 'Нет описания',
        icon: org.photos && org.photos.length > 0 ? org.photos.find((photo) => photo.main)?.url : null,
      }));

      setSearchResults(formattedResults);
    } catch (err) {
      console.error('Ошибка поиска:', err.message);
      setSearchResults([]);
      setError(err.message || 'Ошибка при поиске организаций.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, userId]);

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

  if (error) {
    return <div className="choose-company"><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!userRole) {
    return <div className="choose-company"><p>Загрузка...</p></div>;
  }

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
          {userRole === 'ADMIN' && (
              <button className="create-btn" onClick={handleCreateOrganization}>
                Создать новую организацию
              </button>
          )}
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