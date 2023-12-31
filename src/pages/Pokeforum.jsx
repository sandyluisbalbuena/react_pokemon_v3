import React, { useEffect, useState } from 'react'
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import ForumCategories from '../components/ForumCategories';
import ForumMyThreads from '../components/ForumMyThreads';
import ForumTrendingTopics from '../components/ForumTrendingTopics';
import ForumLatest from '../components/ForumLatest';
import OnlineUsers from '../components/OnlineUsers';
import eventBus from '../eventBus';
import ThreadsPokedex from '../components/ThreadsPokedex';


const Pokeforum = () => {

	let [userdata,setuserdata] = useState([]);

	const [user] = useAuthState(firebase.auth());
	const [username, setUsername] = useState('');
	const [userimage, setUserimage] = useState('');

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
		// sampleFethcWithBearer();
	}, [user]);


	function sampleFethcWithBearer(){

		if(firebase.auth().currentUser){

			const currentUser = firebase.auth().currentUser;
			const bearerToken = localStorage.getItem('bearerToken');

			axios.get('http://127.0.0.1:8000/api/threads', {
			headers: {
				'X-User-Uid': currentUser.uid,
				'Authorization': `Bearer ${bearerToken}`,
			},
			})
			.then(response => {
				console.log(response.data);
			})
			.catch(error => {
				// Handle errors
			});
		}
	}

	const handleCreateThreadPokeforum = () => {
		eventBus.publish('pokeforumCreateThread');
	}

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
									{/* <img className="me-4" width="15%" src={`./assets/images/userIcons/${user && (userimage)}.png`} alt=""/> */}
								</div>

								<button className="btn btn-dark my-2" onClick={handleCreateThreadPokeforum} style={{width:'100%'}} data-mdb-toggle="modal" data-mdb-target="#postThread">
									<i className="far fa-pen-to-square me-1"></i>
									Create Thread
								</button>
							</div>
						</div>

						<ForumCategories/>
	
						<ForumMyThreads />

						<ForumTrendingTopics />

					</div>

					<div id="forumLatest">
						<ForumLatest  user={userdata} />
						{/* <ThreadsPokedex  user={userdata} /> */}
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
											{/* <img className="me-4" width="15%" src={`./assets/images/userIcons/${user && (userimage)}.png`} alt=""/> */}
										</div>

										<button className="btn btn-dark my-2" onClick={handleCreateThreadPokeforum} style={{width:'100%'}} data-mdb-toggle="modal" data-mdb-target="#postThread">
											<i className="far fa-pen-to-square me-1"></i>
											Create Thread
										</button>
									</div>
								</div>
							</div>

							{/* <div className="row">
								<OnlineUsers/>
							</div> */}

							<div className="row">
								<ForumCategories/>
							</div>

							<div className="row">
								<ForumMyThreads />
							</div>

							<div className="row">
								<ForumTrendingTopics />
							</div>

						</div>
					</div>
				</div>


			</section>

		</div>
	)
}

export default Pokeforum