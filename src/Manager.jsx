import React from 'react';
import './Styles/Manager.css';

function Manager() {
  return (
    <div className="App">
      <header className="header">
        <h1>Алиса Маллер</h1>
        <p>HR Telegram</p>
      </header>

      <nav className="profiles">
        <button>Талант</button>
        <button>Менеджер</button>
        <button>Посмотреть все</button>
      </nav>

      <div className="search-bar">
        <input type="text" placeholder="Введите запрос..." />
      </div>

      <div className="categories">
        <button>Организации</button>
        <button>Проекты</button>
        <button>Кастинги и вакансии</button>
      </div>

      <div className="job-listings">
        <div className="job-card">
          <h2>Telegram</h2>
          <p>Senior UI дизайнер</p>
          <p>Санкт-Петербург, Россия</p>
          <p>Fulfitme</p>
          <p>В офисе</p>
          <p>Senior уровень</p>
          <p>От 100 000 ₽</p>
          <p>12.12.2024</p>
        </div>

        <div className="job-card">
          <h2>Telegram</h2>
          <p>Senior UI дизайнер</p>
          <p>Санкт-Петербург, Россия</p>
          <p>Fulfitme</p>
          <p>В офисе</p>
          <p>Senior уровень</p>
          <p>От 100 000 ₽</p>
          <p>12.12.2024</p>
        </div>

        <div className="job-card">
          <h2>Telegram</h2>
          <p>Senior UI дизайнер</p>
          <p>Санкт-Петербург, Россия</p>
          <p>Fulfitme</p>
          <p>В офисе</p>
          <p>Senior уровень</p>
          <p>От 100 000 ₽</p>
          <p>12.12.2024</p>
        </div>
      </div>
    </div>
  );
}

export default Manager;