import React from 'react';
import Message from './Message';
import useGetMessages from '../hooks/useGetMessages';
import { useSelector } from 'react-redux';

const dayLabel = value => {
  const date = new Date(value);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
};

const Messages = () => {
  useGetMessages();
  const { messages, loading, error } = useSelector(store => store.message);
  let previousDay = '';

  if (loading) return <div className="messages-state"><span className="spinner" />Loading conversation…</div>;
  if (error) return <div className="messages-state error"><strong>Something went wrong</strong><span>{error}</span></div>;
  if (!messages.length) return <div className="messages-state"><strong>No messages yet</strong><span>Say hello — this is the beginning of your conversation.</span></div>;

  return (
    <div className="messages-list" role="log" aria-live="polite">
      {messages.map(message => {
        const currentDay = new Date(message.createdAt).toDateString();
        const showDay = currentDay !== previousDay;
        previousDay = currentDay;
        return (
          <React.Fragment key={message._id}>
            {showDay && <div className="day-separator"><span>{dayLabel(message.createdAt)}</span></div>}
            <Message message={message} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Messages;
