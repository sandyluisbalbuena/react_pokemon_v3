import React, { useEffect, useState } from 'react'
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import ForumLatest from '../components/ForumLatest'
import ForumCategories from '../components/ForumCategories';

const Dashboard = () => {

	let [userdata,setuserdata] = useState([]);
	const [username, setUsername] = useState('');
	const [userimage, setUserimage] = useState('');

	const [user] = useAuthState(firebase.auth());

	useEffect(() => {
		if (user) {
		const userRef = firebase.database().ref(`users/${user.uid}`);
		userRef.on('value', (snapshot) => {
			const userData = snapshot.val();
			if (userData) {
				setUsername(userData.username.toUpperCase() || '');
				setUserimage(userData.image || 'pikachu');
				setuserdata(userData);
			}
		});
		}
	}, [user]);

	return (
		<div className="container">

			<section className="row mt-5">
			</section>

			<section className="row d-flex mt-4" id="pokedexSectionResult">

				<div className="col-12 col-lg-9">

					<div className="d-lg-none">
						<div className="card my-4 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
							<div className="card-body container-fluid">

								<div className="navbar rounded" style={{backgroundColor: '#D1CFC9'}}>
									<h6 className="m-auto">{user && (username !== '' ? username : user.displayName)}</h6>
								</div>

							</div>
						</div>

						<ForumCategories/>
	
					</div>

					<div id="forumLatest">
						<ForumLatest  user={userdata} dashboard={1}/>
					</div>

				</div>

				<div className="d-none d-lg-block col-lg-3">
					<div style={{height:'98%'}}>
						<div style={{ position: 'sticky', top: '70px'}}>

							<div className="row">
								<div className="card my-4 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
									<div className="card-body container-fluid">

										<div className="navbar rounded" style={{backgroundColor: '#D1CFC9'}}>
											<h6 className="m-auto">{user && (username !== '' ? username : user.displayName)}</h6>
										</div>

									</div>
								</div>
							</div>


							<div className="row">
								<ForumCategories/>
							</div>

						</div>
					</div>
				</div>

			</section>

		</div>
	)
}

export default Dashboard