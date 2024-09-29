import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import editIcon from '../assets/icons/navbar/edit.svg';
import clipboardIcon from '../assets/icons/navbar/clipboard.svg';
import searchIcon from '../assets/icons/navbar/search.svg';
import bellIcon from '../assets/icons/navbar/bell.svg';
import notebuxIcon from '../assets/icons/navbar/NOTEBUX.svg'; 
import './Navbar.css'; 
import { signInWithPopup, auth, provider } from '../firebaseConfig';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';


const NavbarComponent = () => {
  const [user, setUser] = useState(null); 

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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      console.log("User Info: ", loggedInUser);
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };
  return (
    <Navbar bg="light" expand="lg" className="px-4">
      <Navbar.Brand href="/" className="d-flex align-items-center">
        <img src={notebuxIcon} alt="Notebux Logo" className="navbar-logo me-2" /> 
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/create" className="d-flex align-items-center">
            <img src={editIcon} alt="Create Icon" className="nav-icon me-2" />
            Create
          </Nav.Link>
          <Nav.Link as={Link} to="/drafts" className="d-flex align-items-center">
            <img src={clipboardIcon} alt="Drafts Icon" className="nav-icon me-2" />
            Drafts
          </Nav.Link>
          <Nav.Link as={Link} to="/browse" className="d-flex align-items-center">
            <img src={searchIcon} alt="Browse Icon" className="nav-icon me-2" />
            Browse
          </Nav.Link>
          <Nav.Link as={Link} to="/alerts" className="d-flex align-items-center">
            <img src={bellIcon} alt="Alerts Icon" className="nav-icon me-2" />
            Alerts
          </Nav.Link>

          {user ? (
        <div className="user-info">
          <img
            src={user.photoURL}
            alt="Profile"
            className="profile-pic"
            referrerPolicy="no-referrer"
          />
          <Button variant="outline-danger" className="ms-3" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      ):(
        <Button variant="outline-danger" className="ms-3" onClick={handleGoogleLogin}>
          Login
        </Button>
      )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
