import React from 'react';
import OtherUser from './OtherUser';
import useGetOtherUsers from '../hooks/useGetOtherUsers';
import { useSelector } from 'react-redux';

const OtherUsers = ({ users, isSearching }) => {
  useGetOtherUsers();
  const { otherUsers } = useSelector(store => store.user);

  if (otherUsers === null) return <div className="contact-state"><span className="spinner" />Loading people…</div>;
  if (!users.length) {
    return (
      <div className="contact-state">
        <strong>{isSearching ? 'No matching people' : 'No one else is here yet'}</strong>
        <span>{isSearching ? 'Try another name or username.' : 'Create another account to start chatting.'}</span>
      </div>
    );
  }

  return <div className="contact-list">{users.map(user => <OtherUser key={user._id} user={user} />)}</div>;
};

export default OtherUsers;
