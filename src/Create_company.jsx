import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/Create_company.css';

function CreateOrganization() {
    const [orgName, setOrgName] = useState('');
    const [description, setDescription] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [city, setCity] = useState('');
    const [photoFile, setPhotoFile] = useState(null);
    const [photoPreview, setPhotoPreview] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const createSpecialization = async (specializationName) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Токен не найден. Пожалуйста, войдите снова.');
            }

            const response = await fetch('/specialization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: specializationName,
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    navigate('/login');
                    return null;
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Специализация создана:', data);
            return data.id;
        } catch (err) {
            console.error('Ошибка создания специализации:', err.message);
            throw err;
        }
    };

    const uploadPhoto = async (file, orgId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Токен не найден. Пожалуйста, войдите снова.');
            }

            // Создаём объект FormData для отправки файла
            const formData = new FormData();
            formData.append('photo', file); // Добавляем файл как MultipartFile
            formData.append('otherId', orgId);
            formData.append('type', 'ORGANIZATION');
            formData.append('main', 'true');

            console.log('Отправляемые данные для загрузки фото:', {
                otherId: orgId,
                type: 'ORGANIZATION',
                main: true,
                photo: file.name,
            });

            // Отправляем файл через axios
            const response = await axios.post('/api/v1/photo/one', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Фото загружено:', response.data);
            return response.data;
        } catch (err) {
            console.error('Ошибка загрузки фото:', err.response?.data?.message || err.message);
            throw err;
        }
    };

    const handleCreate = async () => {
        if (!orgName) {
            setError('Пожалуйста, введите название организации');
            return;
        }
        if (!description || !specialization) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('Токен не найден. Пожалуйста, войдите снова.');
            }

            const specializationId = await createSpecialization(specialization);
            if (!specializationId) {
                throw new Error('Не удалось создать специализацию');
            }

            const telegramHandle = orgName.startsWith('@') ? orgName.substring(1) : orgName;

            const requestBody = {
                name: telegramHandle,
                description: `${description}\n${city || 'Санкт-Петербург, Россия'}\nЦифровое творчество`,
                specializationIds: [specializationId],
            };

            console.log('Отправляемые данные для создания организации:', requestBody);

            const orgResponse = await fetch('/organisation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!orgResponse.ok) {
                if (orgResponse.status === 401) {
                    navigate('/login');
                    return;
                }
                const errorData = await orgResponse.json().catch(() => ({}));
                throw new Error(errorData.message || `Ошибка ${orgResponse.status}: ${response.statusText}`);
            }

            const orgData = await orgResponse.json();
            console.log('Организация создана:', orgData);
            const orgId = Number(orgData.id);
            console.log('orgId:', orgId, typeof orgId);

            if (photoFile) {
                const photoData = await uploadPhoto(photoFile, orgId);
                if (!photoData) {
                    throw new Error('Не удалось загрузить фото');
                }
            }

            navigate(`/organization/${orgId}`);
        } catch (err) {
            console.error('Ошибка:', err.message);
            setError(err.message || 'Не удалось создать организацию. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/company');
    };

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

        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setError('');
    };

    const handleClearPhoto = () => {
        setPhotoFile(null);
        setPhotoPreview('');
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="create-organization">
            <h1 className="title">CastFind</h1>
            <p className="subtitle">
                Введите основную информацию о вашей организации
            </p>
            {error && <p className="error-message">{error}</p>}
            <div className="form-section">
                <h3>Введите название организации</h3>
                <div className="input-with-icon-left">
                    <label
                        className={`plus-button ${photoPreview ? 'photo-selected' : ''}`}
                        style={{
                            backgroundImage: photoPreview ? `url(${photoPreview})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {!photoPreview && <span className="plus-icon">+</span>}
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAddPhoto}
                        />
                        {photoPreview && (
                            <span className="clear-photo" onClick={handleClearPhoto}>
                                ×
                            </span>
                        )}
                    </label>
                    <input
                        type="text"
                        className="telegram-input"
                        placeholder="TelegramHandle"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                    />
                </div>
            </div>
            <hr className="section-divider" />
            <div className="form-section-city">
                <h4>Немного об организации</h4>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="city-input"
                        placeholder="Описание (например: фотография, digital art)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <h4>Специализация вашей компании</h4>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="city-input"
                        placeholder="Специализация (например: дизайн, маркетинг)"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="city-input"
                        placeholder="Город (например: Москва)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
            </div>
            <div className="action-buttons">
                <button
                    className="back-btn"
                    onClick={handleBack}
                    disabled={isLoading}
                >
                    Вернуться к поиску
                </button>
                <button
                    className="create-btn"
                    onClick={handleCreate}
                    disabled={isLoading}
                >
                    {isLoading ? 'Создание...' : 'Создать организацию'}
                </button>
            </div>
        </div>
    );
}

export default CreateOrganization;