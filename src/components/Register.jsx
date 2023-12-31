import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/database';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repassword, setRePassword] = useState('');
	const [username, setUsername] = useState('');
	const [image, setImage] = useState('pikachu');
	const navigate = useNavigate();
	const [agree, setAgree] = useState(false);

	const handleCheckboxChange = () => {
		setAgree(!agree);
	};

	const googleProvider = new GoogleAuthProvider();	
	const facebookProvider = new FacebookAuthProvider();	

	// const handleRegister = async () => {
	// 	try {
	// 		await firebase.auth().createUserWithEmailAndPassword(email, password);
	// 		const userId = firebase.auth().currentUser.uid;
	// 		const userRef = firebase.database().ref(`users/${userId}`);
	// 		userRef.set({ 
	// 			username,
	// 			image
	// 		});

	// 		Swal.fire({
	// 			icon: 'success',
	// 			text: 'Successfully create an account.',
	// 			footer: '<a href="">Why do I have this issue?</a>'
	// 		})

	// 		let templateParams = {
	// 			from_name: 'Pokemon',
	// 			to_name: email,
	// 			message: 'This is a test email message.'
	// 		};
			

	// 		emailjs.send("service_cyqrhaq","template_9ghriyi",templateParams);

	// 		navigate('/');


	// 		const user = firebase.auth().currentUser;
	// 		const onlineUsersRef = firebase.database().ref('onlineUsers'); // or use Firestore reference if using Firestore
	// 		onlineUsersRef.child(user.uid).set(true); 

	// 	} catch (error) {
	// 		Swal.fire({
	// 			icon: 'error',
	// 			title: 'Oops...',
	// 			text: error,
	// 			footer: '<a href="">Why do I have this issue?</a>'
	// 		})
	// 	}
	// };

	const handleRegister = async () => {
		if (!email || !password || !repassword || !username || !image || !agreeCheckbox) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Please fill in all the required fields.',
			footer: '<a href="">Why do I have this issue?</a>'
		});
		return;
		}
	
		if (password !== repassword) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Passwords do not match.',
				footer: '<a href="">Why do I have this issue?</a>'
			});
			return;
		}
	
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
			text: 'Successfully created an account.',
		});
	
		let templateParams = {
			from_name: 'Pokemon',
			to_name: email,
			message: 'This is a test email message.'
		};
		
		await emailjs.send("service_cyqrhaq","template_9ghriyi",templateParams);
	
		navigate('/');
	
		const user = firebase.auth().currentUser;
		const onlineUsersRef = firebase.database().ref('onlineUsers');
		onlineUsersRef.child(user.uid).set(true);
	
		} catch (error) {
		Swal.fire({
			icon: 'error',
			title: 'Oops...',
			text: error.message,
			footer: '<a href="">Why do I have this issue?</a>'
		});
		}
	};
	

	const signInWithGoogle = async () => {
		try {
		await signInWithPopup(firebase.auth(), googleProvider);
		const user = firebase.auth().currentUser;
		const userId = user.uid;
		const email = user.email; // Retrieve the user's email
		const username = user.displayName; // Retrieve the user's email
		const role = 'user'; // Retrieve the user's email
		const userRef = firebase.database().ref(`users/${userId}`);
		
		userRef.set({ 
			username,
			image,
			email,
			role
		});
	
		// Rest of your code...
	
		let templateParams = {
			from_name: 'Pokemon',
			to_name: email,
			message: 'This is a test email message.'
		};
	
		emailjs.send("service_cyqrhaq", "template_9ghriyi", templateParams);
		navigate('/');

		const onlineUsersRef = firebase.database().ref('onlineUsers'); // or use Firestore reference if using Firestore
		onlineUsersRef.child(user.uid).set(true); 
		} catch (error) {
		// Handle the error
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


						<div className="card mx-3 mx-lg-0">
							<div className="card-body">
								<h5 className="card-title">Login</h5>

								<div className="form mb-4">
									<input type="email" placeholder='Email' id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
								</div>

								<div className="form mb-4">
									<input type="text" placeholder='Username' id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required/>
								</div>

								<div className="form mb-4">
									<input type="password" placeholder='Password' id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
								</div>

								<div className="form mb-4">
									<input type="password" placeholder='Confirm Password' id="repassword" className="form-control" value={repassword} onChange={(e) => setRePassword(e.target.value)} required/>
								</div>

								<div className="form-check mb-4">
									<input className="form-check-input" type="checkbox" id="agreeCheckbox" checked={agree} onChange={handleCheckboxChange} required/>
									<label className="form-check-label" htmlFor="agreeCheckbox">
										<span className='text-black'>I agree to this </span>
										<a href="/termsandagreements" target="_blank" rel="noopener noreferrer">
											Terms and Agreements
										</a>
									</label>
								</div>

								<button className="btn btn-primary btn-block btn-dark"  onClick={handleRegister}>Register</button>
								<button className="btn btn-primary btn-block btn-dark"  onClick={signInWithGoogle}>Sign in with Google</button>
								{/* <button className="btn btn-primary btn-block btn-dark"  onClick={signInWithFacebook}>Sign in with Facebook</button> */}
								<a href="/login">Already have an account</a>
							</div>
						</div>

						
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
