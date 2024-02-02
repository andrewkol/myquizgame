import React, { useState } from 'react';
import { firestore, auth } from './firebase';
import { Link } from 'react-router-dom';

const MyForm = () => {
  const initialFormData = {
    name: '',
    email: '',
    message: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await firestore.collection('formData').add(formData);
      setFormData(initialFormData);
      setErrorMessage('');
      setSuccessMessage('Обращение успешно отправлено!');
    } catch (error) {
      setErrorMessage('Ошибка отправки обращения. Попробуйте позже.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="my-form">
      <label className="form-label">
        Имя:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" />
      </label>
      <label className="form-label">
        Почта:
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="form-input" />
      </label>
      <label className="form-label">
        Текст обращения:
        <textarea name="message" value={formData.message} onChange={handleInputChange} className="form-input" />
      </label>
      <button type="submit" className="form-button">Отправить</button>
      {errorMessage && <p className="form-error-message">{errorMessage}</p>}
      {successMessage && <p className="form-success-message">{successMessage}</p>}
    </form>
  );
};

export default MyForm;
