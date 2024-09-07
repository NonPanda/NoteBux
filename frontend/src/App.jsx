import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';  

function App() {
  return (
    <Router>
    <NavbarComponent />
    <Routes>
      <Route path="/create" element={<div>Create Page</div>} />
      <Route path="/drafts" element={<div>Drafts Page</div>} />
      <Route path="/browse" element={<div>Browse Page</div>} />
      <Route path="/alerts" element={<div>Alerts Page</div>} />
    </Routes>
  </Router>
  );
}

export default App;
