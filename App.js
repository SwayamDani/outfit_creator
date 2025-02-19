import React from 'react';
import { UserProvider } from './contexts/UserContext';
import AuthenticatedApp from './components/AuthenticatedApp';

// Separate the authentication wrapper from the main app content
function App() {
  return (
    <UserProvider>
      <AuthenticatedApp />
    </UserProvider>
  );
}

export default App; 