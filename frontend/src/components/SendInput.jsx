import React, { useEffect, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../redux/messageSlice';
import { BASE_URL } from '..';

const SendInput = () => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector(store => store.user);

  useEffect(() => setMessage(''), [selectedUser?._id]);

  const onSubmitHandler = async event => {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage || !selectedUser?._id || sending) return;

    setSending(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/message/send/${selectedUser._id}`, { message: cleanMessage }, { withCredentials: true });
      dispatch(addMessage(res.data.newMessage));
      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || "Message couldn't be sent");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="composer">
      <label className="sr-only" htmlFor="message-input">Message {selectedUser?.fullName}</label>
      <textarea
        id="message-input"
        value={message}
        onChange={event => setMessage(event.target.value.slice(0, 2000))}
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
        rows="1"
        placeholder={`Message ${selectedUser?.fullName}`}
        disabled={sending}
      />
      <button type="submit" className="send-button" disabled={!message.trim() || sending} aria-label="Send message">
        {sending ? <span className="spinner small" /> : <IoSend />}
      </button>
      <span className="composer-hint">Enter to send · Shift + Enter for a new line</span>
    </form>
  );
};

export default SendInput;
