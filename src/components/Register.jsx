import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [image, setImage] = useState('pikachu');
	const navigate = useNavigate();

	const googleProvider = new GoogleAuthProvider();	
	const facebookProvider = new FacebookAuthProvider();	

	const handleRegister = async () => {
		try {
		await firebase.auth().createUserWithEmailAndPassword(email, password);
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.database().ref(`users/${userId}`);
		userRef.set({ 
			username,
			image
		});

		Swal.fire({
			icon: 'success',
			text: 'Successfully create an account.',
			footer: '<a href="">Why do I have this issue?</a>'
		})

		let templateParams = {
			from_name: 'Pokemon',
			to_name: email,
			message: 'This is a test email message.'
		};
		

		emailjs.send("service_cyqrhaq","template_9ghriyi",templateParams);

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

	const signInWithGoogle = async () => {
		try {
		await signInWithPopup(firebase.auth(), googleProvider);
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.database().ref(`users/${userId}`);
		userRef.set({ username });
		// User successfully registered
		
		Swal.fire({
			icon: 'success',
			text: 'Successfully create an account.',
			footer: '<a href="">Why do I have this issue?</a>'

		})

		let templateParams = {
			from_name: 'Pokemon',
			to_name: email,
			message: 'This is a test email message.'
		};
		

		emailjs.send("service_cyqrhaq","template_9ghriyi",templateParams);
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

	const signInWithFacebook = async () => {
		try {
		await signInWithPopup(firebase.auth(), facebookProvider);
		const userId = firebase.auth().currentUser.uid;
		const userRef = firebase.database().ref(`users/${userId}`);
		userRef.set({ username });
		// User successfully registered
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
		<div className="p-5 text-center bg-image hero">
			<div className="mask">
				<div className="d-flex justify-content-center align-items-center h-100">
					<div className="text-white">


						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Login</h5>

								<div className="form mb-4">
									<input type="email" placeholder='Email' id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
								</div>

								<div className="form mb-4">
									<input type="text" placeholder='Username' id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)}/>
								</div>

								<div className="form mb-4">
									<input type="password" placeholder='Password' id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
								</div>

								<button className="btn btn-primary btn-block btn-dark"  onClick={handleRegister}>Register</button>
								<button className="btn btn-primary btn-block btn-dark"  onClick={signInWithGoogle}>Sign in with Google</button>
								<button className="btn btn-primary btn-block btn-dark"  onClick={signInWithFacebook}>Sign in with Facebook</button>
							</div>
						</div>

						
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
