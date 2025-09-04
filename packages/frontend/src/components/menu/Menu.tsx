
import './Menu.css';
import { NavLink } from "react-router-dom";
import { House, PersonPlus, BoxArrowInRight } from 'react-bootstrap-icons';
import { DoorOpen } from 'react-bootstrap-icons'; // 👈 סמל יציאה

export const Menu = () => {
  return (
    <nav className="main-navbar">
      <ul className="menu-nav">
        <li>
          <NavLink className="nav-link" to="/">
            <House className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/signup">
            <PersonPlus className="icon" /> Signup
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/login">
            <BoxArrowInRight className="icon" /> Login
          </NavLink>
        </li>

        {localStorage.getItem('jwtToken') && (
          <li>
            <NavLink className="nav-link" to="/logout">
              <DoorOpen className="icon" /> Logout
            </NavLink>
          </li>
        )}

      </ul>
    </nav>
  );
};
