import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getAvatarUrl } from '../utils/avatar';

const Message = ({ message }) => {
  const scrollRef = useRef();
  const { authUser, selectedUser } = useSelector(store => store.user);
  const isMine = String(message?.senderId || '') === String(authUser?._id || '');
  const sender = isMine ? authUser : selectedUser;
  const time = message?.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [message]);

  return (
    <article ref={scrollRef} className={`message-row ${isMine ? 'mine' : 'theirs'}`}>
      {!isMine && <img className="message-avatar" src={getAvatarUrl(sender)} alt="" />}
      <div className="message-block">
        <div className="message-meta"><strong>{isMine ? 'You' : sender?.fullName}</strong><time dateTime={message.createdAt}>{time}</time></div>
        <div className="message-bubble">{message.message}</div>
      </div>
    </article>
  );
};

export default Message;
