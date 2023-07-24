import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Template from './layout/Template'
import Home from './pages/Home'
import Pokedex from './pages/Pokedex'
import Pokecard from './pages/Pokecard'
import Notfound from './pages/Notfound'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
// import 'firebase/compat/firestore';
import Register from './components/Register';
import Login from './components/Login';
import Pokeforum from './pages/Pokeforum'
import About from './pages/About'
import CreateThreadModal from './components/CreateThreadModal'
import Thread from './pages/Thread'
import Profile from './components/Profile'
import CommunityChat from './components/CommunityChat'
import { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import TermsAndAgreement from './components/TermsAndAgreement'
import ProtectedRoute from './components/ProtectedRoute'
import PokemonRelated from './components/PokemonRelated'

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

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const userAttendanceRef = firebase.database().ref('userAttendance');
	const [userData, setUserData] = useState(null);
	const currentPath = window.location.pathname;

	
	

	// Generate dummy data for daily attendance
	function generateAttendanceData() {
		const attendanceData = {};
	
		// Get today's date and two months ago
		const today = new Date();
		today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
	
		const twoMonthsAgo = new Date();
		twoMonthsAgo.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
		twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
	
		// Iterate through each day from two months ago to today
		for (let date = new Date(twoMonthsAgo); date <= today; date.setDate(date.getDate() + 1)) {
		const attendanceCount = getRandomInt(0, 5850); // Random total attendance count between 0 and 100
	
		attendanceData[date.getTime()] = attendanceCount;
		}
	
		return attendanceData;
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function seedAttendanceData() {
		const attendanceData = generateAttendanceData();
	
		// Push the attendance data to the 'userAttendance' reference
		userAttendanceRef.set(attendanceData, error => {
		if (error) {
			console.error('Error seeding attendance data:', error);
		} else {
			console.log('Attendance data seeded successfully!');
		}
		});
	}

	useEffect(() => {
		// seedAttendanceData();
		const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			setIsLoggedIn(!!user); // Update isLoggedIn based on user authentication
			if (user) {
				// If the user is logged in, fetch their data from the "users" collection
				const usersRef = firebase.database().ref('users');
				usersRef.child(user.uid).once('value')
				.then((snapshot) => {
					const userDataFromFirebase = snapshot.val();
					setUserData(userDataFromFirebase);
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
				});
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(()=>{
		if(!isLoggedIn){
			if (currentPath === '/pokeforum'||currentPath === '/dashboard') {
				window.location.href = '/login';
			}
		}
	},[isLoggedIn])
	

	getToken();
	

	window.addEventListener('beforeunload', function(event) {
		const userRef = firebase.database().ref(`onlineUsers`);
		userRef.child(user.uid).set(false); 
	});

	useEffect(() => {
		const handleBeforeUnload = () => {
			const userRef = firebase.database().ref(`onlineUsers`);
			userRef.child(user.uid).set(false); 
		};
		
		window.addEventListener('beforeunload', handleBeforeUnload);
		
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	function getToken(){
		if (firebase.auth().currentUser) {
			firebase.auth().currentUser.getIdToken(true)
			.then(idToken => {
				const firebaseIdToken = idToken;
				axios.post('https://pok3mon.online/api/firebase-token', { firebase_id_token: firebaseIdToken })
				// axios.post('http://127.0.0.1:8000/api/firebase-token', { firebase_id_token: firebaseIdToken })
				.then(response => {

					const currentUser = firebase.auth().currentUser;
					if (currentUser) {
						const userRef = firebase.database().ref(`users/${currentUser.uid}`);

						localStorage.setItem('bearerToken', response.data.bearer_token);
				
						userRef.once('value')
						.then(snapshot => {
							const userData = snapshot.val();
			
							const updatedData = {
								...userData,
								bearer_token: response.data.bearer_token,
							};
			
							userRef.update(updatedData)
						})
						.catch(error => {
							console.log('Error retrieving user data:', error);
						});
					}
					
				})
				.catch(error => {
					console.error(error);
				});
			})
			.catch(error => {
				console.error(error);
			});
		} else {
			console.log('No user is currently signed in.');
		}
	}	

	

	const handleUnauthenticatedAccessAdmin = async() => {

		try {
			await firebase.auth().signOut();
	
			Swal.fire({
			icon: 'warning',
			text: 'Unauthorized Access!',
			footer: '<a href="">Why do I have this issue?</a>',
			});
	
			const userRef = firebase.database().ref(`onlineUsers`);
			userRef.child(user.uid).set(false);
	
		} catch (error) {
			Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: error,
			footer: '<a href="">Why do I have this issue?</a>',
			});
		}

		window.location.href = '/login';
		console.log(window.location.pathname);
	};

	
	return (
		<>
			<BrowserRouter basename='/'>
				<Routes>
					<Route element={<Template />}>
						<Route path='/' element={<Home />}/>
						<Route path='/pokedex' element={<Pokedex />}/>
						<Route path='/pokecard' element={<Pokecard />}/>
						<Route path='/about' element={<About />}/>
						<Route path='/termsandagreements' element={<TermsAndAgreement />}/>
						<Route path='/pokeforum' element={<Pokeforum />}/>
						<Route path='/pokeforum/:slug' element={<Thread />}/>
						<Route path='/dashboard' element={<Dashboard />}/>
						<Route path='/login' element={<Login />}/>
						<Route path='/register' element={<Register />}/>
					</Route>
					<Route path='*' element={<Notfound />}/>
				</Routes>
				<CreateThreadModal />
				{isLoggedIn && <CommunityChat />}
				<Profile />
			</BrowserRouter>
		</>
	)
}

export default App
