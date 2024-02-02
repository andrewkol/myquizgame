import React from 'react';
import { seedTheme } from './themes.js';

function SeedData() {
  const handleClick = () => {
    seedTheme();
  }

  return (
    <button onClick={handleClick}>Загрузить</button>
  );
}

export default SeedData;