import React, { useState } from 'react'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleLogin = async () => {
		try {
		await firebase.auth().signInWithEmailAndPassword(email, password);
		navigate('/');

		const user = firebase.auth().currentUser;
		const onlineUsersRef = firebase.database().ref('onlineUsers'); // or use Firestore reference if using Firestore
		onlineUsersRef.child(user.uid).set(true); 
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: error,
				footer: '<a href="">Why do I have this issue?</a>'
			})
		}
	};

	const handleLoginWithGoogle = async () => {
		try {
		const provider = new firebase.auth.GoogleAuthProvider();
		await firebase.auth().signInWithPopup(provider);
		navigate('/');

		const user = firebase.auth().currentUser;
		const onlineUsersRef = firebase.database().ref('onlineUsers'); // or use Firestore reference if using Firestore
		onlineUsersRef.child(user.uid).set(true); 

		} catch (error) {
		console.log(error);
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
									<input type="email" placeholder='Email' id="form1Example1" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)}/>
								</div>

								<div className="form mb-4">
									<input type="password" placeholder='Password' id="form1Example2" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}/>
								</div>

								<button type="submit" className="btn btn-primary btn-block btn-dark"  onClick={handleLogin}>Login</button>
								<button className="btn btn-primary btn-block btn-dark" onClick={handleLoginWithGoogle}>Login with Google</button>
								<a href="/register">Don't have an account</a>
							</div>
						</div>

				</div>
			</div>
		</div>
	</div>
	)
}

export default Login