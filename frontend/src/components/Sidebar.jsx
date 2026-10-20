import React, { useMemo, useState } from 'react';
import { BiLogOut, BiSearchAlt2, BiX } from 'react-icons/bi';
import OtherUsers from './OtherUsers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser, setSelectedUser } from '../redux/userSlice';
import { clearMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';
import { getAvatarUrl } from '../utils/avatar';

const Sidebar = () => {
  const [search, setSearch] = useState('');
  const { authUser, otherUsers, unreadByUser } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalUnread = Object.values(unreadByUser || {}).reduce((sum, count) => sum + count, 0);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return otherUsers || [];
    return (otherUsers || []).filter(user =>
      `${user.fullName} ${user.username}`.toLowerCase().includes(term)
    );
  }, [otherUsers, search]);

  const logoutHandler = async () => {
    try {
      await axios.get(`${BASE_URL}/api/v1/user/logout`, { withCredentials: true });
    } catch (error) {
      // Local logout should still work if the API is temporarily unavailable.
    } finally {
      dispatch(setAuthUser(null));
      dispatch(clearMessages());
      dispatch(setSelectedUser(null));
      navigate('/login', { replace: true });
      toast.success('Logged out');
    }
  };

  return (
    <div className="sidebar-content">
      <header className="sidebar-header">
        <div className="brand-mark" aria-hidden="true">C</div>
        <div>
          <p className="eyebrow">Signed in as {authUser?.username}</p>
          <h1>Messages</h1>
        </div>
      </header>

      <div className="search-box">
        <BiSearchAlt2 aria-hidden="true" />
        <input value={search} onChange={event => setSearch(event.target.value)} type="search" placeholder="Search people" aria-label="Search people" />
        {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><BiX /></button>}
      </div>

      <div className="contact-heading"><span>Conversations</span><span className={totalUnread ? 'sidebar-unread-summary' : ''}>{totalUnread ? `${totalUnread} unread` : filteredUsers.length}</span></div>
      <OtherUsers users={filteredUsers} isSearching={Boolean(search.trim())} />

      <footer className="sidebar-footer">
        <div className="current-user">
          <img src={getAvatarUrl(authUser)} alt={`${authUser?.fullName || 'Your'} avatar`} />
          <div><strong>{authUser?.fullName}</strong><span>Available</span></div>
        </div>
        <button className="icon-button" onClick={logoutHandler} title="Log out" aria-label="Log out"><BiLogOut /></button>
      </footer>
    </div>
  );
};

export default Sidebar;
