import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { getAvatarUrl } from '../utils/avatar';

const OtherUser = ({ user }) => {
  const dispatch = useDispatch();
  const { selectedUser, onlineUsers, unreadByUser } = useSelector(store => store.user);
  const isOnline = onlineUsers?.some(id => String(id) === String(user._id));
  const isSelected = String(selectedUser?._id || '') === String(user._id);
  const unreadCount = unreadByUser?.[String(user._id)] || 0;

  return (
    <button type="button" onClick={() => dispatch(setSelectedUser(user))} className={`contact-row ${isSelected ? 'selected' : ''} ${unreadCount ? 'has-unread' : ''}`} aria-pressed={isSelected}>
      <span className="avatar-wrap">
        <img src={getAvatarUrl(user)} alt={`${user.fullName}'s avatar`} />
        <span className={`presence-dot ${isOnline ? 'online' : ''}`} aria-label={isOnline ? 'Online' : 'Offline'} />
      </span>
      <span className="contact-copy"><strong>{user.fullName}</strong><span>{isOnline ? 'Online now' : `@${user.username}`}</span></span>
      {unreadCount ? <span className="unread-badge" aria-label={`${unreadCount} unread messages`}>{unreadCount > 99 ? '99+' : unreadCount}</span> : <span className="contact-chevron" aria-hidden="true">›</span>}
    </button>
  );
};

export default OtherUser;
