import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import paths from '../paths'

const showDevLink = process.env.NODE_ENV === 'development' || window.location.host.includes('dev.') || window.location.host.includes('development.')

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
              <a className="nav-link" href={paths.contributingGuide()}>Contribute</a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
)
