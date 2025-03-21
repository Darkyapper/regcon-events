import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ScrollToTop from './components/scrollToTop/ScrollToTop'
import Home from './pages/Home';
import Login from './pages/Login';
import EventPage from './pages/EventPage';
import TicketBuy from './pages/TicketBuy';
import PaymentCancel from './pages/PaymentCancel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/events/:id" element={<EventPage />} />
          <Route path="/buy-tickets" element={<TicketBuy />} />
          <Route path="/cancel-payment" element={<PaymentCancel />} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
