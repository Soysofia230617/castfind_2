import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './Styles/OrganizationProfile.css';

function OrganizationProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Используем данные из state, если они переданы, или мок-данные
    const mockData = {
        id: Number(id),
        name: 'Telegram',
        description: 'Цифровое творчество Telegram\nСанкт-Петербург, Россия\nДлинное описание о деятельности организации...',
        photos: [
            { id: 1, url: 'https://via.placeholder.com/100' },
            { id: 2, url: 'https://via.placeholder.com/100' },
            { id: 3, url: 'https://via.placeholder.com/100' },
            { id: 4, url: 'https://via.placeholder.com/100' },
        ],
        rating: 5,
    };

    const initialOrganization = location.state?.organization || mockData;

    const [organization, setOrganization] = useState(initialOrganization);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(initialOrganization.name);
    const [description, setDescription] = useState(initialOrganization.description);
    const [photos, setPhotos] = useState(initialOrganization.photos);
    const [error, setError] = useState('');

    // Добавление нового фото (локально)
    const handleAddPhoto = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError('Пожалуйста, выберите фото');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setError('Пожалуйста, выберите файл изображения');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('Файл слишком большой. Выберите фото меньше 5MB.');
            return;
        }

        const newPhoto = {
            id: Date.now(),
            url: URL.createObjectURL(file),
        };
        setPhotos([...photos, newPhoto]);
        setError('');
        e.target.value = ''; // Сбрасываем input
    };

    // Сохранение изменений (локально)
    const handleSave = () => {
        setOrganization({
            ...organization,
            name,
            description,
            photos,
        });
        setIsEditing(false);
        setError('');
    };

    // Переключение режима редактирования
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
        setError('');
    };

    // Навигация по табам
    const handleTabChange = (tab) => {
        console.log(`Переключение на вкладку: ${tab}`);
    };

    return (
        <div className="organization-profile">
            <div className="header">
                <div className="header-background">
                    <div className="header-top">
                        <div className="logo-info">
                            <img src="/telegram-logo.png" alt="Telegram Logo" className="logo" />
                            <span className="info-icon">i</span>
                        </div>
                        <div className="rating">
                            <span>Рейтинг:</span>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="star">★</span>
                            ))}
                        </div>
                    </div>
                    <div className="header-bottom">
                        <div className="title-wrapper">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="title-input"
                                />
                            ) : (
                                <h1 className="title">{name}</h1>
                            )}
                            {!isEditing && (
                                <button className="edit-btn" onClick={toggleEditMode}>
                                    ✏️
                                </button>
                            )}
                        </div>
                        <p className="subtitle">Мобильное приложение</p>
                    </div>
                </div>
            </div>

            <div className="portfolio">
                <div className="portfolio-header">
                    <h2>Портфолио</h2>
                    <button className="view-all-btn">Посмотреть всё</button>
                </div>
                <div className="portfolio-grid">
                    {photos.map((photo) => (
                        <img
                            key={photo.id}
                            src={photo.url}
                            alt="Portfolio item"
                            className="portfolio-item"
                        />
                    ))}
                    {isEditing && (
                        <label className="add-photo-btn">
                            <span>+</span>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAddPhoto}
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="tabs">
                <button
                    className="tab-btn active"
                    onClick={() => handleTabChange('projects')}
                >
                    Проекты
                </button>
                <button
                    className="tab-btn"
                    onClick={() => handleTabChange('castings')}
                >
                    Кастинг и вакансии
                </button>
                <button
                    className="tab-btn"
                    onClick={() => handleTabChange('reviews')}
                >
                    Отзывы
                </button>
            </div>

            <div className="info">
                <h3>Цифровое творчество</h3>
                {isEditing ? (
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-input"
                    />
                ) : (
                    <p>{description}</p>
                )}
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="action-buttons">
                {isEditing ? (
                    <button
                        className="save-btn"
                        onClick={handleSave}
                    >
                        Сохранить
                    </button>
                ) : (
                    <button
                        className="create-project-btn"
                        onClick={() => navigate('/create-project')}
                    >
                        Создать проект
                    </button>
                )}
            </div>

            <div className="bottom-nav">
                <button className="nav-btn" onClick={() => navigate('/')}>
                    🏠
                </button>
                <button className="nav-btn" onClick={() => navigate('/profile')}>
                    👤
                </button>
                <button className="nav-btn active" onClick={() => navigate(`/organization/${id}`)}>
                    🖼️
                </button>
                <button className="nav-btn" onClick={() => navigate('/settings')}>
                    ⚙️
                </button>
            </div>
        </div>
    );
}

export default OrganizationProfile;