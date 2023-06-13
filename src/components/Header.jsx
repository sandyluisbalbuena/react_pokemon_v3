import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import eventBus from '../eventBus';
import  { useAuthState } from 'react-firebase-hooks/auth';
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
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  async function handleLogout (){
		try {
			await firebase.auth().signOut();

      Swal.fire({
				icon: 'success',
				text: 'Successfully Logout.',
				footer: '<a href="">Why do I have this issue?</a>'
			})

  	navigate('/');
		} catch (error) {
      Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error,
				footer: '<a href="">Why do I have this issue?</a>'
			})
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
              <div className="dropdown">
                <a
                  className="dropdown-toggle d-flex align-items-center hidden-arrow"
                  href="#"
                  id="navbarDropdownMenuAvatar"
                  role="button"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className={`nav-link text-white  ${activeLink === 'login' ? 'active' : ''}`}>
                  {username !== '' ? username : user.displayName}
                  </span>
                  <div className="rounded-circle bg-secondary ms-3"><img className="m-1" width="30px" src={`./assets/images/userIcons/${userimage}.png`}/></div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuAvatar">
                  <li>
                    <a className="dropdown-item" href="#">My profile</a>
                  </li>
                  {/* <li>
                    <a className="dropdown-item" href="#">Settings</a>
                  </li> */}
                  <li>
                    <a className="dropdown-item" onClick={handleLogout} href="#">Logout</a>
                  </li>
                </ul>
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