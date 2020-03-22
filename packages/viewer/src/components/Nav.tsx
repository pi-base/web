import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default React.memo(
  function Navigation(props: any) {
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
)
