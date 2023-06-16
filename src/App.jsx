import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Template from './layout/Template'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import Pokecard from './pages/Pokecard'
import Notfound from './pages/Notfound'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import Register from './components/Register';
import Login from './components/Login';
import Pokeforum from './pages/Pokeforum'
import About from './pages/About'
import CreateThreadModal from './components/CreateThreadModal'


const firebaseConfig = {
	apiKey: "AIzaSyAkcEiOtDBFQEqFYyIoFHN8Ahtx_iWK0Dk",
	authDomain: "pokemon-react-450b4.firebaseapp.com",
	databaseURL: "https://pokemon-react-450b4-default-rtdb.asia-southeast1.firebasedatabase.app/",
	projectId: "pokemon-react-450b4",
	storageBucket: "pokemon-react-450b4.appspot.com",
	messagingSenderId: "432272926404",
	appId: "1:432272926404:web:785bf8f889c60330eb0b91",
	measurementId: "G-VX64J9CB20"
};

firebase.initializeApp(firebaseConfig);


function App() {

	return (
		<>
			<BrowserRouter basename='/'>
				<Routes>
					<Route element={<Template />}>
						<Route path='/' element={<Home />}/>
						<Route path='/pokedex' element={<Pokedex />}/>
						<Route path='/pokecard' element={<Pokecard />}/>
						<Route path='/pokeforum' element={<Pokeforum />}/>
						<Route path='/about' element={<About />}/>
						<Route path='/login' element={<Login />}/>
						<Route path='/register' element={<Register />}/>
					</Route>
					<Route path='*' element={<Notfound />}/>
				</Routes>
			</BrowserRouter>

			<CreateThreadModal />
		</>
	)
}

export default App
