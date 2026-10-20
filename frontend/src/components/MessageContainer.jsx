import React from 'react';
import { BiArrowBack, BiMessageRoundedDots } from 'react-icons/bi';
import SendInput from './SendInput';
import Messages from './Messages';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { clearMessages } from '../redux/messageSlice';
import { getAvatarUrl } from '../utils/avatar';

const MessageContainer = () => {
  const dispatch = useDispatch();
  const { selectedUser, authUser, onlineUsers } = useSelector(store => store.user);
  const isOnline = onlineUsers?.some(id => String(id) === String(selectedUser?._id));

  const goBack = () => {
    dispatch(setSelectedUser(null));
    dispatch(clearMessages());
  };

  if (!selectedUser) {
    return (
      <div className="empty-conversation">
        <div className="empty-icon"><BiMessageRoundedDots /></div>
        <p className="eyebrow">Your conversations</p>
        <h2>Hi, {authUser?.fullName?.split(' ')[0]}</h2>
        <p>Choose a person from the left to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="conversation-content">
      <header className="conversation-header">
        <button className="icon-button back-button" onClick={goBack} aria-label="Back to conversations"><BiArrowBack /></button>
        <span className="avatar-wrap large">
          <img src={getAvatarUrl(selectedUser)} alt={`${selectedUser.fullName}'s avatar`} />
          <span className={`presence-dot ${isOnline ? 'online' : ''}`} />
        </span>
        <div className="conversation-person">
          <strong>{selectedUser.fullName}</strong>
          <span>{isOnline ? 'Online now' : `@${selectedUser.username}`}</span>
        </div>
        <div className="identity-key" aria-label="Message color guide"><span />Your messages</div>
      </header>
      <Messages />
      <SendInput />
    </div>
  );
};

export default MessageContainer;
