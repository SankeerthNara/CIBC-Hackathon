import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CustomerC360Page } from './pages/CustomerC360Page';
import { CollectionsAskPage } from './pages/CollectionsAskPage';
import { NbaQueuePage } from './pages/NbaQueuePage';
import { GovernancePage } from './pages/GovernancePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-brand-cream text-brand-navy">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/customer/G-004817" replace />} />
            <Route path="/customer/:id" element={<CustomerC360Page />} />
            <Route path="/ask" element={<CollectionsAskPage />} />
            <Route path="/nba" element={<NbaQueuePage />} />
            <Route path="/governance" element={<GovernancePage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/customer/G-004817" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
