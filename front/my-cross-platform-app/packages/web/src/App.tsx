import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import MapPage from './pages/MapPage';
import CafeDetailPage from './pages/CafeDetailPage';
import CafeListPage from './pages/CafeListPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/list" element={<CafeListPage />} />
        <Route path="/cafe/:id" element={<CafeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;