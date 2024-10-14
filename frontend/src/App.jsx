import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Landing from './components/Landing'; 
import SearchPage from './components/SearchPage';
import CreatePage from './components/CreatePage';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';
import DraftsPage from './components/Drafts';
import AlertsPage from './components/Alerts';
import Alert from './components/alertscreate';

function App() {
  const [user, setUser] = useState(null);

  // Manage user state here
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log("Current User:", user); 

  return (
    <Router>
      <NavbarComponent user={user} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<SearchPage user={user} />} />
        <Route path="/create" element={<CreatePage user={user} />} />
        <Route path="/drafts" element={<DraftsPage user={user} />} />
        <Route path="/alerts" element={<AlertsPage user={user} />} />
        <Route path="/alertscreate" element={<Alert user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;
