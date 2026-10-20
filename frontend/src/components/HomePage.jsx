import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageContainer from './MessageContainer';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { authUser, selectedUser } = useSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) navigate('/login', { replace: true });
  }, [authUser, navigate]);

  if (!authUser) return null;

  return (
    <main className="app-shell">
      <section className={`sidebar-panel ${selectedUser ? 'mobile-hidden' : ''}`}>
        <Sidebar />
      </section>
      <section className={`conversation-panel ${!selectedUser ? 'mobile-hidden' : ''}`}>
        <MessageContainer />
      </section>
    </main>
  );
};

export default HomePage;
