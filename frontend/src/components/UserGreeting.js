import React from 'react';

const UserGreeting = ({ user, handleLogout }) => (
  <div>
    <p>Welcome, {user.username || user.displayName}!</p>
    <button onClick={handleLogout}>Logout</button>
  </div>
);

export default UserGreeting;
