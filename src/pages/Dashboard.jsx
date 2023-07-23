import React, { useEffect, useState } from 'react'
import  { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import ForumLatest from '../components/ForumLatest'
import ForumCategories from '../components/ForumCategories';
import ChartThreads from '../components/ChartThreads';
import ChartAttendance from '../components/ChartAttendance';
import ChartPieThreads from '../components/ChartPieThreads';
import ChartUserActivities from '../components/ChartUserActivities';
import { Categories } from 'emoji-picker-react';
import Candidates from '../components/Candidates';
import Moderators from '../components/Moderators';

const Dashboard = () => {

	let [userdata,setuserdata] = useState([]);
	const [username, setUsername] = useState('');
	const [userimage, setUserimage] = useState('');
	const [currentRole, setCurrentRole] = useState('');

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
				setCurrentRole(userData.role);
			}
		});
		}
	}, [user]);

	function hideAndShow(element){
		if(element == 'usersUtil'){
			document.getElementById('usersUtilelement').style.display = 'block';
			document.getElementById('threadsUtilelement').style.display = 'none';
		}
		else{
			document.getElementById('usersUtilelement').style.display = 'none';
			document.getElementById('threadsUtilelement').style.display = 'block';
		}
	}

	return (
		<div className="container">

			<section className="row mt-5">
			</section>

			<section className="row d-flex mt-4" id="pokedexSectionResult">

				<div className="col-12 col-lg-9">

					{/* <div className="d-lg-none">
						<div className="card my-4 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{borderRadius: '5px', height: '100%'}} id="secondCard">
							<div className="card-body container-fluid">

								<div className="navbar rounded" style={{backgroundColor: '#D1CFC9'}}>
									<h6 className="m-auto">{user && (username !== '' ? username : user.displayName)}</h6>
								</div>

							</div>
						</div>

						<ForumCategories/>
					</div> */}

					<div id="threadsUtilelement">
						<div className='row my-4'>
							<div className="col-12 col-lg-4">
								<ChartPieThreads />
							</div>
							<div className="d-none d-lg-block col-lg-8">
								<ChartThreads />
							</div>
						</div>

						
						<div id="forumLatest">
							<ForumLatest  user={userdata} dashboard={1}/>
						</div>
					</div>

					<div id="usersUtilelement" style={{display:'none'}}>
						<div className='row my-4'>
							<div id="chartAttendance">
								<ChartAttendance />
							</div>
							<div id="chartActivities" className='my-3'>
								<ChartUserActivities />
							</div>
						</div>
					</div>

					<div id="usersUtilelement" className='d-lg-none'>
						<div className='row my-4'>

							{currentRole == 'admin' && (
								<div className='my-2'>
									<Moderators />
								</div>
							)}
						


							<div className='my-2'>
								<Candidates />
							</div>

						</div>
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
								<div className="card mb-2 px-1 animate__animated animate__fadeIn animate__delay-1s" style={{ borderRadius: '5px', height: '100%' }}>
									<div className="card-body container-fluid">
										<div className="d-flex justify-content-between" type="button" data-mdb-toggle="collapse" data-mdb-target="#utilities" aria-expanded="true" aria-controls="utilities">
										<h6 className="ms-4">Utilities</h6>
										<i className="fas fa-angles-down"></i>
										</div>
										<ul className="collapse show mt-3" id="utilities" style={{ listStyleType: 'none' }}>
											<li className="px-2 py-1 rounded list-group-item threads-latest my-2" type="button" id="usersUtil" onClick={()=>hideAndShow('usersUtil')} style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
												Users
											</li>
											<li className="px-2 py-1 rounded list-group-item threads-latest my-2" type="button" id="threadsUtil" onClick={()=>hideAndShow('threadsUtil')} style={{ fontSize: '12px', textDecoration: 'none', color: 'black' }}>
												Threads
											</li>
										</ul>
									</div>
								</div>
							</div>

							
							{currentRole == 'admin' && (
								<div className='row my-2'>
									<Moderators />
								</div>
							)}

							<div className="row">
								<Candidates />
							</div>

							

						</div>
					</div>
				</div>

			</section>

		</div>
	)
}

export default Dashboard