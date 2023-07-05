import React, { useEffect, useState } from 'react'
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import ForumCategories from '../components/ForumCategories'
import ForumThread from '../components/ForumThread'
import OnlineUsers from '../components/OnlineUsers'
import ForumMyThreads from '../components/ForumMyThreads'
import ForumTrendingTopics from '../components/ForumTrendingTopics';

const Thread = () => {

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
				setUsername(userData.username || '');
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

			<section className="row d-flex mt-5" id="pokedexSectionResult">
				<div className="col-12 col-lg-9 px-3 px-lg-1 animate__animated animate__fadeInUp">
					<ForumThread />
				</div>
				<div className="d-none d-lg-block col-lg-3 animate__animated animate__fadeIn">
					<div className="container" style={{height:'100%'}}>
							<div style={{position: '-webkit-sticky', position: 'sticky', top: '70px'}}>

								<div className="row">
									<OnlineUsers/>
								</div>

								<div className="row">
									<ForumCategories />
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

export default Thread