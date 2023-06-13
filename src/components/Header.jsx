import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PokedexContext from '../PokedexContext';
import eventBus from '../eventBus';
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';



const Header = () => {

  const pokemonSearch = useContext(PokedexContext);
  const [user] = useAuthState(firebase.auth());


  let [activeLink, setActiveLink] = useState('');
  const location = useLocation();


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
    // Extract the link name from the current path
    const link = currentPath.substring(1);
    setActiveLink(link);
  }, [location.pathname]);


  const handleSearch = () => {
    
    eventBus.publish('searchPokemon', document.getElementById('pokemonNameInputSearch').value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  async function handleLogout (){
		try {
			await firebase.auth().signOut();
		} catch (error) {

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
              src="./assets/images/brand/pokemonBrandName.png"
              height="30"
              alt="Pokemon"
              loading="lazy"
            />
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to='/' onClick={() => handleNavLinkClick('home')} className="nav-link hvr-underline-from-center {activeLink === 'pokedex' ? 'active' : ''}">Home</Link>
            </li>
            <li className="nav-item">
              <Link to='/pokedex' onClick={() => handleNavLinkClick('pokedex')} className="nav-link hvr-underline-from-center {activeLink === 'pokedex' ? 'active' : ''}">Pokedex</Link>
            </li>
            <li className="nav-item">
              <Link to='/pokecard' onClick={() => handleNavLinkClick('pokecard')} className="nav-link hvr-underline-from-center {activeLink === 'pokedex' ? 'active' : ''}">Pokecard</Link>
            </li>
          </ul>

          

          {activeLink === 'pokedex' && (
            <div id="pokemonSearchBar" className="d-flex input-group w-auto me-5">
              <input id="pokemonNameInputSearch" type="search" className="form-control rounded" placeholder="Pokemon Name" aria-label="Search" aria-describedby="search-addon" onKeyPress={handleKeyPress} required/>
              <button className="btn bg-dark" onClick={handleSearch}>
                <i className="fas fa-search text-white"></i>
              </button>
            </div>
          )}

          {activeLink === 'pokecard' && (
            <div id="pokemonCardSearchBar" className="d-flex input-group w-auto me-5">
              <input id="pokemonName" type="search" className="form-control rounded" placeholder="Pokemon Card Name" aria-label="Search" aria-describedby="search-addon" required/>
              <button className="btn bg-dark">
                <i className="fas fa-search text-white"></i>
              </button>
            </div>
          )}

          {user ? (
            <>
              <div className="navbar-nav mb-2 mb-lg-0  input-group w-auto me-5">
                <li className="nav-item">
                  <span className={`nav-link hvr-underline-from-center ${activeLink === 'login' ? 'active' : ''}`}>
                    {user.displayName}
                  </span>
                </li>
                <li className="nav-item">
                  {/* <button className={`nav-link btn hvr-underline-from-center ${activeLink === 'register' ? 'active' : ''}`} > */}
                  <span className={`nav-link hvr-underline-from-center ${activeLink === 'register' ? 'active' : ''}`} onClick={handleLogout}>
                    Logout
                  </span>
                </li>
              </div>
            </>
          ) : (
            <ul className="navbar-nav mb-2 mb-lg-0  input-group w-auto me-5">
              <li className="nav-item">
                <Link
                  to="/login"
                  className={`nav-link hvr-underline-from-center ${activeLink === 'login' ? 'active' : ''}`}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/register"
                  className={`nav-link hvr-underline-from-center ${activeLink === 'register' ? 'active' : ''}`}
                >
                  Register
                </Link>
              </li>
            </ul>
          )}

        </div>
      </div>
    </nav>
  </header>
  )
}

export default Header