import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import axios from 'axios';

import logo from '/logo.png';
import './NavBar.css';
import { logout } from '../../feature/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthenticated } from '../../feature/loginSignupReducer';
import { API_BASE_URL } from '../../config/config';
const NavBar = () => {
  const dispatch = useDispatch();
  const [menu, setMenu] = useState("Home");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState('');
  const navigation = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserDetails();
    }
  });


  // Fetching Logined User Details

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { username } = response.data;
      localStorage.setItem('username', username);
      setUsername(username);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // MenuToogle Bar
  const handleMenuToggle = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Responsive Menu 
  const handleMenuItemClick = (menuItem) => {
    setMenu(menuItem);
    setMenuVisible(false);
  };


  // Logout handled
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/auth/logout/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setUsername('');
      dispatch(logout());
      navigation('/login');
    } catch (error) {
      console.error('Error logging out:', error);

    }
  };

  return (
    <>
      <div className="navbar">
        <div onClick={() => handleMenuItemClick('Home')} className="nav-log" >
          <Link to='/'><img src={logo} alt="" /></Link>
          {menu === 'Home' ? <hr /> : <></>}
        </div>

        <ul className={`nav-menu ${isMenuVisible ? 'visible' : ''}`}>
          <li onClick={() => handleMenuItemClick('Home')}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/">Home</Link>
            {menu === 'Home' ? <hr /> : <></>}
          </li>
          <li onClick={() => handleMenuItemClick('About Us')}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/">About Us</Link>
            {menu === 'About Us' ? <hr /> : <></>}
          </li>
          <li onClick={() => handleMenuItemClick('Services')}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/service">Services</Link>
            {menu === 'Services' ? <hr /> : <></>}
          </li>
          <li onClick={() => handleMenuItemClick('Contact Us')}>
            <Link style={{ textDecoration: 'none', color: 'black' }} to="/">Contact Us</Link>
            {menu === 'Contact Us' ? <hr /> : <></>}
          </li>
        </ul>

        {/* """Check if the user has the token. If true, display the user name and logout button""" */}
        <div className="nav-login">
          {localStorage.getItem('token') ? (
            <>
              <p>Hi, {username}</p>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>

        <button className="menu-bars" onClick={handleMenuToggle}>
          <FaBars />
        </button>
      </div>
    </>
  );
};

export default NavBar;