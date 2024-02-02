import React, { createContext, useEffect, useState } from 'react';
import { auth } from './firebase';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);

    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Ошибка входа:', error);
      const errorElement = document.createElement('div');
      errorElement.textContent = 'Ошибка входа: ' + error.message;
      errorElement.style.display = 'flex';
      errorElement.style.justifyContent = 'center';
      const myElement = document.getElementById('dfd');
      if (!myElement) {
        errorElement.id = "dfd";
        document.body.appendChild(errorElement);
      } else {
        myElement.textContent = errorElement.textContent;
      }
    }
  };


  const signUp = async (email, password) => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      const errorElement = document.createElement('div');
      errorElement.textContent = 'Ошибка регистрации: ' + error.message;
      errorElement.style.display = 'flex';
      errorElement.style.justifyContent = 'center';
      const myElement = document.getElementById('dfd');
      if (!myElement) {
        errorElement.id = "dfd";
        document.body.appendChild(errorElement);
      } else {
        myElement.textContent = errorElement.textContent;
      }
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;