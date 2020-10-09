import React from 'react'

import { Container, Nav, Navbar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import paths from '../paths'
import { MAIN_BRANCH } from '../models/Store'
import { FaCodeBranch } from 'react-icons/fa'

const showDevLink = process.env.NODE_ENV === 'development' || window.location.host.includes('dev.') || window.location.host.includes('development.')

const BranchTile = ({ branch }: { branch: string }) => (
  <button className="nav-link">
    <FaCodeBranch />
    {' '}
    {branch}
  </button>
)

export default React.memo(
  function Navigation({ branch }: { branch: string }) {
    return (
      <Navbar bg={branch === MAIN_BRANCH ? "light" : "dark"}>
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
              {branch !== MAIN_BRANCH && <BranchTile branch={branch} />}
              {showDevLink && <Link className="nav-link" to="/dev">Dev</Link>}
              <a className="nav-link" href={paths.contributingGuide()}>Contribute</a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
)
