import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import eventBus from '../eventBus';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [user] = useAuthState(firebase.auth());
  const navigate = useNavigate();
  let [activeLink, setActiveLink] = useState('');
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [userimage, setUserimage] = useState('');

  let handleNavLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem('activeLink', link);
  };

  useEffect(() => {
    const storedActiveLink = localStorage.getItem('activeLink');
    if (storedActiveLink) {
      setActiveLink(storedActiveLink);
    }
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const link = currentPath.substring(1);
    setActiveLink(link);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const userRef = firebase.database().ref(`users/${user.uid}`);
      userRef.on('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          setUsername(userData.username || '');
          setUserimage(userData.image || 'pikachu');
        }
      });
    }
  }, [user]);

  const handleSearch = () => {
    eventBus.publish('searchPokemon', document.getElementById('pokemonNameInputSearch').value);
  };

  const handleCardSearch = () => {
    eventBus.publish('getonecard', document.getElementById('pokemonCardNameInputSearch').value);
  };

  const handleKeyPress = (event) => {
    if (document.getElementById('pokemonNameInputSearch')) {
      if (event.key === 'Enter') {
        handleSearch();
      }
    } else {
      if (event.key === 'Enter') {
        handleCardSearch();
      }
    }
  };

  async function handleLogout() {
    try {
      await firebase.auth().signOut();

      Swal.fire({
        icon: 'success',
        text: 'Successfully Logout.',
        footer: '<a href="">Why do I have this issue?</a>',
      });

      const userRef = firebase.database().ref(`onlineUsers`);
      userRef.child(user.uid).set(false);
      // userRef.update(false);

      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
  }

  const closeMobileNavbar = () => {
    const navbarToggle = document.getElementById('navbarSupportedContent');
    if (navbarToggle.classList.contains('show')) {
      navbarToggle.classList.remove('show');
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <a className="navbar-brand mt-2 mt-lg-0" href="/">
              <img
                src="../assets/images/brand/pokemonBrandName.png"
                height="30"
                alt="Pokemon"
                loading="lazy"
              />
            </a>

            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/"
                  onClick={() => {
                    handleNavLinkClick('home');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'home' ? 'active' : ''
                  }`}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/pokedex"
                  onClick={() => {
                    handleNavLinkClick('pokedex');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'pokedex' ? 'active' : ''
                  }`}
                >
                  Pokedex
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/pokecard"
                  onClick={() => {
                    handleNavLinkClick('pokecard');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'pokecard' ? 'active' : ''
                  }`}
                >
                  Pokecard
                </Link>
              </li>
              {user ? (
                <Link
                  to="/pokeforum"
                  onClick={() => {
                    handleNavLinkClick('pokeforum');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'pokeforum' ? 'active' : ''
                  }`}
                >
                  Pokeforum
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => {
                    handleNavLinkClick('login');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'login' ? 'active' : ''
                  }`}
                >
                  Pokeforum
                </Link>
              )}
              <li className="nav-item">
                <Link
                  to="/about"
                  onClick={() => {
                    handleNavLinkClick('about');
                    closeMobileNavbar();
                  }}
                  className={`nav-link hvr-underline-from-center ${
                    activeLink === 'about' ? 'active' : ''
                  }`}
                >
                  About
                </Link>
              </li>
            </ul>

            {activeLink === 'pokedex' && (
              <div id="pokemonSearchBar" className="d-flex input-group w-auto me-5">
                <input
                  id="pokemonNameInputSearch"
                  type="search"
                  className="form-control rounded"
                  placeholder="Pokemon Name"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onKeyPress={handleKeyPress}
                  required
                />
                <button className="btn bg-dark" onClick={handleSearch}>
                  <i className="fas fa-search text-white"></i>
                </button>
              </div>
            )}

            {activeLink === 'pokecard' && (
              <div id="pokemonCardSearchBar" className="d-flex input-group w-auto me-5">
                <input
                  id="pokemonCardNameInputSearch"
                  type="search"
                  className="form-control rounded"
                  placeholder="Pokemon Card Name"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  onKeyPress={handleKeyPress}
                  required
                />
                <button className="btn bg-dark" onClick={handleCardSearch}>
                  <i className="fas fa-search text-white"></i>
                </button>
              </div>
            )}

            {!user ? (
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link
                    to="/register"
                    onClick={() => {
                      handleNavLinkClick('register');
                      closeMobileNavbar();
                    }}
                    className={`nav-link hvr-underline-from-center ${
                      activeLink === 'register' ? 'active' : ''
                    }`}
                  >
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/login"
                    onClick={() => {
                      handleNavLinkClick('login');
                      closeMobileNavbar();
                    }}
                    className={`nav-link hvr-underline-from-center ${
                      activeLink === 'login' ? 'active' : ''
                    }`}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="d-flex align-items-center">
                <span className="navbar-text mx-2">{username}</span>
                <Link
                  to={`/profile/${user.uid}`}
                  onClick={() => {
                    handleNavLinkClick('profile');
                    closeMobileNavbar();
                  }}
                >
                  <img
                    src={userimage ? userimage : '../assets/images/profile/pikachu.png'}
                    alt="Profile"
                    className="rounded-circle"
                    width="30"
                    height="30"
                  />
                </Link>
                <button className="btn btn-link text-white" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
