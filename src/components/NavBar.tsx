import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css';

const NavBar = () => {
  return (
    <div className='navbarcontainer'>
      <Navbar.Brand className='logo-temp' href="#home">
        MF
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link className='navBarLink' href="#home">Home</Nav.Link>
        <Nav.Link className='navBarLink' href="#projects">Projects</Nav.Link>
        <Nav.Link className='navBarLink' href="#education">Education</Nav.Link>
        <Nav.Link className='navBarLink' href="#contacts">Contacts</Nav.Link>
      </Nav>
    </div>
  );
};

export default NavBar;

/*
<img
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
*/