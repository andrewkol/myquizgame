import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

const AuthForm = ({ onSubmit, buttonText, errorMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="my-form">
      {errorMessage && <div className="error">{errorMessage}</div>}
      <label className="form-label">
        <span>Почта:</span>
        <input
          type="email" className="form-input" 
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="form-label">
        <span>Пароль:</span>
        <input
          type="password" className="form-input" 
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <button type="submit" className="form-button">{buttonText}</button>
    </form>
  );
};

export const Login = () => {
  const { signIn, currentUser } = useContext(AuthContext);
  const { errorMessage, setErrorMessage } = useState("");

  const handleSignIn = (email, password) => {
    signIn(email, password)
      .then(() => {
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  if (currentUser) {
    return <Navigate to="/game" replace={true} />;
  }

  return (
    <AuthForm
      onSubmit={handleSignIn}
      buttonText="Войти"
      errorMessage={errorMessage}
      />
  );
};

export const Registration = () => {
  const { signUp, currentUser } = useContext(AuthContext);
  const { errorMessage, setErrorMessage } = useState('');

  const handleSignUp = (email, password) => {
    signUp(email, password)
      .then(() => {
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  if (currentUser) {
    return <Navigate to="/game" replace={true} />;
  }

  return (
    <AuthForm
      onSubmit={handleSignUp}
      buttonText="Регистрация"
      errorMessage={errorMessage}
    />
  );
};
