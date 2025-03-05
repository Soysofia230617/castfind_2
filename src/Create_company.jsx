import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Create_company.css';

function CreateOrganization() {
    const [orgName, setOrgName] = useState('');
    const [city, setCity] = useState('');
    const [industry, setIndustry] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!orgName || !city || !industry) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const response = await fetch('http://your-backend-api/api/organizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                body: JSON.stringify({
                    name: orgName,
                    city,
                    industry,
                }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании организации');
            }

            const data = await response.json();
            console.log('Организация создана:', data);
            navigate('/choose-company');
        } catch (err) {
            console.error('Ошибка:', err.message);
            setError('Не удалось создать организацию. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/choose-company');
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
                  <span className="plus-icon-container">
                    <span className="plus-icon">+</span>
                  </span>
                        <input
                            type="text"
                            placeholder="Telegram"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                        />
                </div>
            </div>
            <div className="form-section">
                <h3>Укажите отрасль организации</h3>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Введите название города"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <div className="input-with-icon-right">
                    <input
                        type="text"
                        placeholder="Например: фотография, digital art"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                    />
                    <span className="p-icon">P</span>
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