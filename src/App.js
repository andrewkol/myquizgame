import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './AuthContext';
import Game from './Game';
import { Login, Registration } from './AuthProvider';
import Main from './Main';
import About from './About';
import Appeal from './Appeal';
import Top from './Top';
import SeedData from './Go';
import Lobby from './Lobby';
import Room from './Room';


function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/go" element={<SeedData />} />
            <Route path="/top" element={<Top />} />
            <Route path="/main" element={<Main />} />
            <Route path="/appeal" element={<Appeal />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/game" element={<Game />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;