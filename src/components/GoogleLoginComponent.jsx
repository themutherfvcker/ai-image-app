import React from 'react';

function GoogleLoginComponent() {
  // Redirect user to backend Google OAuth endpoint
  const handleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <button onClick={handleLogin}>
      Sign in with Google
    </button>
  );
}

export default GoogleLoginComponent;