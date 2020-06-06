import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import paths from '../paths'

const showDevLink = process.env.NODE_ENV === 'development' || window.location.host.startsWith('dev.')

export default React.memo(
  function Navigation() {
    return (
      <Navbar bg="light">
        <Container>
          <Navbar.Brand>
            <Link to="/">π-Base</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav>
              <Link className="nav-link" to="/spaces">Spaces</Link>
              <Link className="nav-link" to="/properties">Properties</Link>
              <Link className="nav-link" to="/theorems">Theorems</Link>
            </Nav>
            <Nav className="ml-auto">
              {showDevLink && <Link className="nav-link" to="/dev">Dev</Link>}
              <Link className="nav-link" to={paths.contributingGuide()}>Contribute</Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
)
